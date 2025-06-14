
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyProjects = () => {
  const { user } = useAuth();

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
                Manage and track your projects
              </p>
            </div>
            <Link to="/create-project">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
