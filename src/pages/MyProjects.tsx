
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderOpen, Loader2, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserProjects } from '@/hooks/useUserProjects';
import { UserProjectCard } from '@/components/UserProjectCard';

const MyProjects = () => {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useUserProjects();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your projects</h1>
          </div>
        </div>
      </div>
    );
  }

  const ownedProjects = projects?.filter(p => p.role === 'owner') || [];
  const memberProjects = projects?.filter(p => p.role === 'member') || [];
  const activeProjects = projects?.filter(p => p.status === 'in_progress') || [];
  const completedProjects = projects?.filter(p => p.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                My Projects
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your created projects and view projects you've joined
              </p>
            </div>
            <Link to="/create-project">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          {projects && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Projects</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{projects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeProjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Collaborations</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{memberProjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedProjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading your projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Error loading projects
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {error.message || 'Something went wrong while loading your projects'}
              </p>
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
                No projects yet
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Start your journey by creating your first project and collaborating with other developers
              </p>
              <Link to="/create-project">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Owned Projects */}
              {ownedProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Projects</h2>
                    <Badge variant="secondary">{ownedProjects.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownedProjects.map((project) => (
                      <UserProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {/* Member Projects */}
              {memberProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Collaborations</h2>
                    <Badge variant="secondary">{memberProjects.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memberProjects.map((project) => (
                      <UserProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
