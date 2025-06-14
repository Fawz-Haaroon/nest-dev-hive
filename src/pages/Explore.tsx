
import { Navbar } from '@/components/Navbar';
import { ExploreProjectsSection } from '@/components/ExploreProjectsSection';
import { EnhancedSearchBar } from '@/components/EnhancedSearchBar';

const Explore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Explore Projects
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Discover amazing projects, connect with talented developers, and find your next collaboration
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <EnhancedSearchBar />
            </div>
          </div>
          
          <ExploreProjectsSection />
        </div>
      </div>
    </div>
  );
};

export default Explore;
