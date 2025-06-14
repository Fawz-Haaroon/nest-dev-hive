
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Users, ArrowUp, ExternalLink, Github, Play, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVoteProject } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const voteProject = useVoteProject();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'expert': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
      case 'paused': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    voteProject.mutate(project.id);
  };

  const handleJoinProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/project/${project.id}/apply`);
  };

  const handleViewProject = () => {
    navigate(`/project/${project.id}`);
  };

  const handleContactOwner = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/messages?user=${project.owner_id}`);
  };

  const ownerInitials = project.owner_username 
    ? project.owner_username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
      {/* Media Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {project.video_url ? (
          <div className="relative w-full h-full">
            <video 
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            >
              <source src={project.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20"></div>
            <Play className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/80" />
          </div>
        ) : project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-white text-2xl font-bold opacity-80">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton projectId={project.id} />
        </div>

        {/* Status & Difficulty Badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge className={`${getDifficultyColor(project.difficulty)} text-xs font-medium border backdrop-blur-sm`}>
            {project.difficulty}
          </Badge>
          <Badge className={`${getStatusColor(project.status)} text-xs font-medium border backdrop-blur-sm`}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="p-6" onClick={handleViewProject}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
            {project.title}
          </h3>
          <button 
            onClick={handleVote}
            disabled={!user || voteProject.isPending}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{project.upvotes || 0}</span>
          </button>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack && project.tech_stack.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
              +{project.tech_stack.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6 ring-2 ring-blue-200 dark:ring-blue-800">
                <AvatarImage src={project.owner_avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {ownerInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {project.owner_full_name || project.owner_username || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.member_count || 0}/{project.max_members}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {project.repository_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs hover:scale-105 transition-transform" 
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={project.repository_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3 mr-1" />
                  Code
                </a>
              </Button>
            )}
            {project.live_demo_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs hover:scale-105 transition-transform" 
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs hover:scale-105 transition-transform"
              onClick={handleContactOwner}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button 
              size="sm" 
              className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              onClick={handleJoinProject}
            >
              Join Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
