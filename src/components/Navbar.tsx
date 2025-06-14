
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedSearchBar } from '@/components/EnhancedSearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserDropdown } from '@/components/UserDropdown';
import { Bell, Plus, MessageCircle, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              ProjectNest
            </div>
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <EnhancedSearchBar 
              onSelectProject={(project) => navigate(`/project/${project.id}`)}
              className="w-full"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExploreProjects}
              className="hidden xl:flex text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Explore Projects
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMessages}
                  className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotifications}
                  className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                <Link to="/create-project">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-xl font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </Link>

                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-xl font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <EnhancedSearchBar 
            onSelectProject={(project) => navigate(`/project/${project.id}`)}
            className="w-full"
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleExploreProjects}
                className="justify-start text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Explore Projects
              </Button>
              {!user && (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
