
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  user: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export const useProjectMembers = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      console.log('Fetching members for project:', projectId);

      const { data, error } = await supabase
        .from('project_members')
        .select(`
          id,
          user_id,
          project_id,
          role,
          joined_at,
          user:profiles!user_id(
            id,
            username,
            full_name,
            avatar_url,
            bio
          )
        `)
        .eq('project_id', projectId)
        .order('joined_at', { ascending: true });

      if (error) {
        console.error('Error fetching project members:', error);
        throw error;
      }
      
      console.log('Raw fetched members data:', data);
      const members = data as ProjectMember[];
      console.log('Processed members:', members);
      console.log('Member count:', members?.length);
      return members;
    },
    enabled: !!projectId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 10000, // Refetch every 10 seconds to ensure fresh data
    staleTime: 0, // Always consider data stale
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, reason }: { memberId: string; reason?: string }) => {
      console.log('Removing member:', memberId);
      
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error removing member:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      
      toast({
        title: 'Member Removed',
        description: 'Team member has been removed from the project.',
      });
    },
    onError: (error) => {
      console.error('Remove member error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useLeaveProjectRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, message }: { projectId: string; message?: string }) => {
      console.log('Sending leave request for project:', projectId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create a notification for the project owner
      const { data: project } = await supabase
        .from('projects')
        .select('owner_id, title')
        .eq('id', projectId)
        .single();

      if (!project) throw new Error('Project not found');

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: project.owner_id,
          title: 'Leave Request',
          message: `${user.email} wants to leave "${project.title}". ${message ? `Message: ${message}` : ''}`,
          type: 'application',
          related_project_id: projectId,
          related_user_id: user.id
        }]);

      if (error) {
        console.error('Error creating leave request notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Leave Request Sent',
        description: 'Your request to leave the project has been sent to the project owner.',
      });
    },
    onError: (error) => {
      console.error('Leave request error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
