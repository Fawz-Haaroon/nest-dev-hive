
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <UserProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
