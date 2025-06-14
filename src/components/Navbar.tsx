
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserDropdown } from '@/components/UserDropdown';
import { Bell, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExploreProjects = () => {
    const projectsSection = document.getElementById('featured-projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleMessages = () => {
    navigate('/messages');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              ProjectNest
            </div>
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar onSelectProject={(project) => navigate(`/project/${project.id}`)} />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExploreProjects}
              className="hidden sm:flex text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Explore Projects
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMessages}
                  className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotifications}
                  className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                    3
                  </Badge>
                </Button>

                <Link to="/create-project">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Plus className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </Link>

                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <SearchBar onSelectProject={(project) => navigate(`/project/${project.id}`)} />
        </div>
      </div>
    </nav>
  );
};
