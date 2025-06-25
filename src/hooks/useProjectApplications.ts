
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  applicant?: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    skills: string[] | null;
  };
}

export const useProjectApplications = (projectId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['project-applications', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];

      const { data, error } = await supabase
        .from('project_applications')
        .select(`
          id,
          project_id,
          applicant_id,
          message,
          status,
          created_at,
          applicant:profiles!applicant_id(
            id,
            username,
            full_name,
            avatar_url,
            bio,
            skills
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProjectApplication[];
    },
    enabled: !!projectId && !!user,
  });
};

export const useUserApplicationStatus = (projectId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-application-status', projectId, user?.id],
    queryFn: async () => {
      if (!projectId || !user) return null;

      const { data, error } = await supabase
        .from('project_applications')
        .select('id, status, created_at')
        .eq('project_id', projectId)
        .eq('applicant_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!projectId && !!user,
  });
};

export const useApplyToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ projectId, message }: { projectId: string; message?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_applications')
        .insert([{
          project_id: projectId,
          applicant_id: user.id,
          message: message || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-applications'] });
      queryClient.invalidateQueries({ queryKey: ['user-application-status', variables.projectId] });
      toast({
        title: 'Application Sent',
        description: 'Your application has been sent to the project owner.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: 'approved' | 'rejected' }) => {
      console.log('Updating application status:', { applicationId, status });
      
      // First, get the application details
      const { data: application, error: fetchError } = await supabase
        .from('project_applications')
        .select('project_id, applicant_id')
        .eq('id', applicationId)
        .single();

      if (fetchError) {
        console.error('Error fetching application:', fetchError);
        throw fetchError;
      }

      console.log('Application details:', application);

      // Update the application status
      const { data: updatedApplication, error: updateError } = await supabase
        .from('project_applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating application status:', updateError);
        throw updateError;
      }

      console.log('Updated application:', updatedApplication);

      // If approved, add the user to project_members
      if (status === 'approved' && application) {
        console.log('Adding user to project members:', {
          project_id: application.project_id,
          user_id: application.applicant_id
        });

        // Check if user is already a member
        const { data: existingMember } = await supabase
          .from('project_members')
          .select('id')
          .eq('project_id', application.project_id)
          .eq('user_id', application.applicant_id)
          .single();

        if (!existingMember) {
          const { error: memberError } = await supabase
            .from('project_members')
            .insert([{
              project_id: application.project_id,
              user_id: application.applicant_id,
              role: 'member'
            }]);

          if (memberError) {
            console.error('Error adding user to project members:', memberError);
            throw memberError;
          }

          console.log('Successfully added user to project members');
        } else {
          console.log('User is already a member of this project');
        }
      }

      return updatedApplication;
    },
    onSuccess: (data, variables) => {
      // Invalidate all relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['project-applications'] });
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      toast({
        title: 'Application Updated',
        description: `Application ${variables.status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    },
    onError: (error) => {
      console.error('Update application status error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('project_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-applications'] });
      queryClient.invalidateQueries({ queryKey: ['user-application-status'] });
      toast({
        title: 'Application Deleted',
        description: 'Your application has been withdrawn.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
