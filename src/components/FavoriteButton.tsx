
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoriteProject } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteButtonProps {
  projectId: string;
  className?: string;
}

export const FavoriteButton = ({ projectId, className }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const favoriteProject = useFavoriteProject();

  const { data: isFavorited = false } = useQuery({
    queryKey: ['favorite-status', projectId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data } = await supabase
        .from('project_favorites')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();
      
      return !!data;
    },
    enabled: !!user,
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) return;
    favoriteProject.mutate(projectId);
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleFavorite}
      disabled={favoriteProject.isPending}
      className={`h-8 w-8 p-0 hover:bg-white/20 transition-all duration-200 ${className}`}
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isFavorited 
            ? 'fill-red-500 text-red-500 scale-110' 
            : 'text-white/70 hover:text-red-400 hover:scale-110'
        }`} 
      />
    </Button>
  );
};
