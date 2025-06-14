
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ArrowUp, ExternalLink, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVoteProject } from '@/hooks/useProjects';
import type { Project } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { user } = useAuth();
  const voteProject = useVoteProject();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'paused': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleVote = () => {
    if (!user) return;
    voteProject.mutate(project.id);
  };

  const ownerInitials = project.owner_username 
    ? project.owner_username.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge className={`${getDifficultyColor(project.difficulty)} text-xs font-medium border`}>
              {project.difficulty}
            </Badge>
            <Badge className={`${getStatusColor(project.status)} text-xs font-medium border`}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <button 
            onClick={handleVote}
            disabled={!user || voteProject.isPending}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{project.upvotes || 0}</span>
          </button>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer">
          {project.title}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack && project.tech_stack.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
              +{project.tech_stack.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.owner_avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {ownerInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-slate-700">
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
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <a href={project.repository_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3 mr-1" />
                  Code
                </a>
              </Button>
            )}
            {project.live_demo_url && (
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Join Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
