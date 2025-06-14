
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Link } from 'react-router-dom';
import type { Project } from '@/hooks/useProjects';

const Favorites = () => {
  const { user } = useAuth();
  const { data: favorites = [], isLoading } = useFavorites(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Please sign in to view your favorites
            </h1>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                My Favorites
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Projects you've saved for later
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              // Transform the favorite data to match Project interface
              const project: Project = {
                ...favorite.projects,
                status: favorite.projects.status as 'open' | 'in_progress' | 'completed' | 'paused',
                difficulty: favorite.projects.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert'
              };
              return (
                <ProjectCard key={favorite.id} project={project} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No favorites yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start exploring projects and save the ones you love!
            </p>
            <Link to="/">
              <Button>Explore Projects</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
