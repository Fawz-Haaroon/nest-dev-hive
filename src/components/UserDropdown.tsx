
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, FolderOpen, Plus } from 'lucide-react';

interface UserDropdownProps {
  setIsAuthenticated: (value: boolean) => void;
}

export const UserDropdown = ({ setIsAuthenticated }: UserDropdownProps) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-blue-200">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-slate-200 rounded-xl shadow-lg" align="end">
        <div className="flex items-center gap-3 p-3 border-b border-slate-100">
          <Avatar className="h-10 w-10 border-2 border-blue-200">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">John Doe</span>
            <span className="text-xs text-slate-500">john@example.com</span>
          </div>
        </div>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
          <User className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-700">View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
          <FolderOpen className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-700">My Projects</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
          <Plus className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-700">New Project</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-1 bg-slate-100" />
        
        <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-700">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-3 p-3 hover:bg-red-50 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
