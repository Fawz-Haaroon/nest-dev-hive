
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

      if (error) throw error;
      return data as ProjectMember[];
    },
    enabled: !!projectId,
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ memberId, reason }: { memberId: string; reason?: string }) => {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      toast({
        title: 'Member Removed',
        description: 'Team member has been removed from the project.',
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

export const useLeaveProjectRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, message }: { projectId: string; message?: string }) => {
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

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Leave Request Sent',
        description: 'Your request to leave the project has been sent to the project owner.',
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
