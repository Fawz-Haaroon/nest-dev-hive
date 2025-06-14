
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserDropdown } from '@/components/UserDropdown';
import { Bell, Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProjectNest
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-80">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects, skills, or people..."
                className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link to="/create-project">
                      <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Plus className="w-4 h-4" />
                        New Project
                      </Button>
                    </Link>
                    
                    <button className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    
                    <UserDropdown />
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-600 hover:text-blue-600"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
