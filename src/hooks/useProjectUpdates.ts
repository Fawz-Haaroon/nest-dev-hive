
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectUpdate {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  content: string;
  update_type: 'general' | 'milestone' | 'release' | 'announcement';
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const useProjectUpdates = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-updates', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_updates')
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(update => ({
        ...update,
        author: update.profiles
      })) as ProjectUpdate[];
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updateData: Omit<ProjectUpdate, 'id' | 'created_at' | 'updated_at' | 'author_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_updates')
        .insert([{ 
          ...updateData,
          author_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-updates', data.project_id] });
      toast({
        title: 'Success',
        description: 'Project update posted successfully!',
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
