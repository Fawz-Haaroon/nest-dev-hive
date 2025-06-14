
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = (userId?: string) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('project_favorites')
        .select(`
          *,
          projects:project_id (
            *,
            profiles:owner_id (username, full_name, avatar_url)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useFavoriteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already favorited
      const { data: existing } = await supabase
        .from('project_favorites')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('project_favorites')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add favorite
        const { error } = await supabase
          .from('project_favorites')
          .insert([{ project_id: projectId, user_id: user.id }]);
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: result.action === 'added' ? 'Added to Favorites' : 'Removed from Favorites',
        description: result.action === 'added' 
          ? 'Project saved to your favorites!' 
          : 'Project removed from favorites.',
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
