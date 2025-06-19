
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Calendar, ExternalLink, Github, Settings, Star } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectTimeline } from '@/components/ProjectTimeline';
import { ProjectComments } from '@/components/ProjectComments';
import { ProjectMembersList } from '@/components/ProjectMembersList';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useProjectMembers } from '@/hooks/useProjectMembers';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { data: members } = useProjectMembers(projectId);
  
  const project = projects?.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === project.owner_id;
  const canPostUpdates = isOwner; // Add member check later

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
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const currentMemberCount = members?.length || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 ml-auto">
              <FavoriteButton projectId={project.id} />
              {isOwner && (
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="pt-6">
                  {project.image_url && (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    {project.description}
                  </p>

                  {project.detailed_description && (
                    <div className="prose dark:prose-invert max-w-none">
                      <h3 className="text-lg font-semibold mb-3">About this project</h3>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {project.detailed_description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comments">Discussion</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="space-y-6">
                  <ProjectTimeline projectId={project.id} canPost={canPostUpdates} />
                </TabsContent>
                <TabsContent value="comments" className="space-y-6">
                  <ProjectComments projectId={project.id} />
                </TabsContent>
                <TabsContent value="members" className="space-y-6">
                  <ProjectMembersList projectId={project.id} isOwner={isOwner} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-2">Owner</h4>
                    <p className="text-slate-900 dark:text-slate-100">{project.owner_username}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-2">Team Size</h4>
                    <p className="text-slate-900 dark:text-slate-100">{currentMemberCount} / {project.max_members} members</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-2">Created</h4>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {(project.repository_url || project.live_demo_url) && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-400 mb-3">Links</h4>
                      <div className="space-y-2">
                        {project.repository_url && (
                          <Button variant="outline" asChild className="w-full justify-start">
                            <a href={project.repository_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Repository
                            </a>
                          </Button>
                        )}
                        {project.live_demo_url && (
                          <Button variant="outline" asChild className="w-full justify-start">
                            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.tech_stack.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
