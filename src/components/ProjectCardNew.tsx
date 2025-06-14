
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Users, Star, ExternalLink, Github, Calendar, Eye } from 'lucide-react';
import { ProjectNew } from '@/hooks/useProjectsNew';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useFavoriteProject } from '@/hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProjectCardNewProps {
  project: ProjectNew;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export const ProjectCardNew = ({ project, onFavorite, isFavorited }: ProjectCardNewProps) => {
  const { user } = useAuth();
  const favoriteProject = useFavoriteProject();

  const { data: projectOwner } = useQuery({
    queryKey: ['projectOwner', project.owner_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', project.owner_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: isProjectFavorited = false } = useQuery({
    queryKey: ['favorite-status', project.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data } = await supabase
        .from('project_favorites')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .single();
      
      return !!data;
    },
    enabled: !!user,
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to favorite projects.",
        variant: "destructive",
      });
      return;
    }
    favoriteProject.mutate(project.id);
  };

  const handleJoinProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join projects.",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Implement join project functionality
    toast({
      title: "Join request sent",
      description: "Your request to join this project has been sent!",
    });
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // TODO: Navigate to profile page
    console.log('View profile:', projectOwner?.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
      {project.image_url && (
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {project.featured && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
            >
              <Heart className={`w-4 h-4 transition-all duration-200 ${
                isProjectFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white hover:text-red-400'
              }`} />
            </Button>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getDifficultyColor(project.difficulty)}>
            {project.difficulty}
          </Badge>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.current_members}/{project.max_members}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={projectOwner?.avatar_url || ''} />
              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {projectOwner?.full_name?.[0] || projectOwner?.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleViewProfile}
              className="text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {projectOwner?.full_name || projectOwner?.username || 'Unknown'}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewProfile}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {project.github_url && (
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.live_demo_url && (
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={handleJoinProject}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Join Project
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
