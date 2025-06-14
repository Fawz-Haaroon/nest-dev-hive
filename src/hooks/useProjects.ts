
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  owner_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'paused';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  tech_stack: string[];
  repository_url?: string;
  live_demo_url?: string;
  max_members: number;
  image_url?: string;
  video_url?: string;
  demo_images?: string[];
  media_urls?: any;
  created_at: string;
  updated_at: string;
  owner_username?: string;
  owner_full_name?: string;
  owner_avatar_url?: string;
  member_count?: number;
  upvotes?: number;
  favorites?: number;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_with_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'owner_id' | 'owner_username' | 'owner_full_name' | 'owner_avatar_url' | 'member_count' | 'upvotes' | 'favorites'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          ...projectData,
          owner_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Success',
        description: 'Project created successfully!',
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

export const useVoteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('project_votes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Remove vote
        const { error } = await supabase
          .from('project_votes')
          .delete()
          .eq('id', existingVote.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add vote
        const { error } = await supabase
          .from('project_votes')
          .insert([{ project_id: projectId, user_id: user.id }]);
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
