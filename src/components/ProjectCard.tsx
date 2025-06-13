
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Star, ArrowUp } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  status: string;
  owner: string;
  members: number;
  upvotes: number;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
              {project.status}
            </Badge>
          </div>
          <button className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{project.upvotes}</span>
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
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-700">by {project.owner}</span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.members} members</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              View Details
            </Button>
            <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Join Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
