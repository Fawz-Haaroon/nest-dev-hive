
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FavoriteButton } from '@/components/FavoriteButton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Users, ArrowUp, ExternalLink, Github, Play, MessageCircle, Star, Eye, Calendar } from 'lucide-react';
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
    const colors = {
      beginner: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-700/30',
      intermediate: 'bg-amber-500/10 text-amber-700 border-amber-200/50 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-700/30',
      advanced: 'bg-red-500/10 text-red-700 border-red-200/50 dark:bg-red-400/10 dark:text-red-400 dark:border-red-700/30',
      expert: 'bg-purple-500/10 text-purple-700 border-purple-200/50 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-700/30',
    };
    return colors[difficulty.toLowerCase()] || 'bg-gray-500/10 text-gray-700 border-gray-200/50';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-500/10 text-green-700 border-green-200/50 dark:bg-green-400/10 dark:text-green-400 dark:border-green-700/30',
      in_progress: 'bg-blue-500/10 text-blue-700 border-blue-200/50 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-700/30',
      completed: 'bg-purple-500/10 text-purple-700 border-purple-200/50 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-700/30',
      paused: 'bg-gray-500/10 text-gray-700 border-gray-200/50 dark:bg-gray-400/10 dark:text-gray-400 dark:border-gray-700/30',
    };
    return colors[status.toLowerCase()] || 'bg-gray-500/10 text-gray-700 border-gray-200/50';
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
    : 'UN';

  return (
    <div className="group bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/60 hover:shadow-2xl dark:hover:shadow-2xl/20 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01]">
      {/* Media Section */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
        {project.video_url ? (
          <div className="relative w-full h-full">
            <video 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            >
              <source src={project.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ) : project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-white text-4xl font-bold opacity-80">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Top Row - Status and Favorite */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className={`${getDifficultyColor(project.difficulty)} text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm border`}>
              {project.difficulty}
            </Badge>
            <Badge className={`${getStatusColor(project.status)} text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm border`}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <FavoriteButton projectId={project.id} />
        </div>

        {/* Bottom Right - Vote Button */}
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={handleVote}
            disabled={!user || voteProject.isPending}
            className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg font-semibold"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm">{project.upvotes || 0}</span>
          </button>
        </div>
      </div>

      {/* Content Section - Properly Spaced */}
      <div className="p-6" onClick={handleViewProject}>
        {/* Title and Description */}
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
            {project.title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech Stack - Better Spacing */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-blue-100/80 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack && project.tech_stack.length > 3 && (
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>

        {/* Owner and Actions Section - Better Layout */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer group/owner">
                <Avatar className="w-9 h-9 ring-2 ring-blue-200/60 dark:ring-blue-800/60 group-hover/owner:ring-blue-400 dark:group-hover/owner:ring-blue-600 transition-all">
                  <AvatarImage src={project.owner_avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {ownerInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover/owner:text-blue-600 dark:group-hover/owner:text-blue-400 transition-colors">
                    {project.owner_full_name || project.owner_username || 'Unknown'}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.member_count || 0}/{project.max_members}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={project.owner_avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {ownerInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {project.owner_full_name || project.owner_username || 'Unknown'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Project Owner • Active since {new Date(project.created_at).getFullYear()}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          {/* Action Buttons - Better Spacing and Container */}
          <div className="flex items-center gap-2 ml-4">
            {project.repository_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-3 py-2 h-8 border-slate-300/60 dark:border-slate-600/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 rounded-lg" 
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
                className="text-xs px-3 py-2 h-8 border-slate-300/60 dark:border-slate-600/60 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200 rounded-lg" 
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3 h-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-3 py-2 h-8 border-slate-300/60 dark:border-slate-600/60 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-200 rounded-lg"
              onClick={handleContactOwner}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button 
              size="sm" 
              className="text-xs px-4 py-2 h-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold rounded-lg"
              onClick={handleJoinProject}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
