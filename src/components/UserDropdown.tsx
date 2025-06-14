
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, FolderOpen, Plus, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const UserDropdown = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(user?.id);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.username 
    ? profile.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-200">
          <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg backdrop-blur-sm" align="end">
        <div className="flex items-center gap-3 p-3 border-b border-slate-100 dark:border-slate-700">
          <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {profile?.full_name || profile?.username || 'User'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</span>
          </div>
        </div>
        
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          onClick={() => navigate('/profile')}
        >
          <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          onClick={() => navigate('/my-projects')}
        >
          <FolderOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">My Projects</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          onClick={() => navigate('/favorites')}
        >
          <Heart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Favorites</span>
        </DropdownMenuItem>
        
        <Link to="/create-project">
          <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">New Project</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />
        
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-400">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
