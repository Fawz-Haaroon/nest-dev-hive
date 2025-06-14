
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProjectFilters } from '@/components/ProjectFilters';
import { ProjectCardNew } from '@/components/ProjectCardNew';
import { useProjectsNew } from '@/hooks/useProjectsNew';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [filters, setFilters] = useState<{
    category?: string;
    tags?: string[];
    difficulty?: string;
    status?: string;
    search?: string;
  }>({ category: initialCategory });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: projects = [], isLoading, error } = useProjectsNew(filters);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading projects</h1>
            <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Explore Projects
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Discover amazing projects, connect with talented developers, and find your next collaboration
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <ProjectFilters 
              onFiltersChange={handleFiltersChange} 
              selectedCategory={initialCategory}
            />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {isLoading ? 'Loading...' : `${projects.length} Projects Found`}
              </h2>
              {filters.category && (
                <span className="text-slate-600 dark:text-slate-400 text-lg">
                  in {filters.category.replace('-', ' ')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Link to="/create-project">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              {projects.map((project) => (
                <ProjectCardNew
                  key={project.id}
                  project={project}
                  onFavorite={() => console.log('Favorite project:', project.id)}
                  isFavorited={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter className="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
                No projects found
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms to find more projects
              </p>
              <Link to="/create-project">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Create the First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
