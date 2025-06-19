
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectComment {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  replies?: ProjectComment[];
}

export const useProjectComments = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_comments')
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const comments = data?.map(comment => ({
        ...comment,
        author: comment.profiles
      })) as ProjectComment[];

      // Organize comments into threads
      const commentMap = new Map();
      const topLevelComments: ProjectComment[] = [];

      comments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      comments.forEach(comment => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          topLevelComments.push(commentMap.get(comment.id));
        }
      });

      return topLevelComments;
    },
    enabled: !!projectId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commentData: { project_id: string; content: string; parent_id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_comments')
        .insert([{ 
          ...commentData,
          author_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', data.project_id] });
      toast({
        title: 'Success',
        description: 'Comment posted successfully!',
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
