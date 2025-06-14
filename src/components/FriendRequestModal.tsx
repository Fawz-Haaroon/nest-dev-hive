
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, UserPlus, Eye } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FriendRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FriendRequestModal = ({ open, onOpenChange }: FriendRequestModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sendFriendRequest, allFriendships } = useFriends();

  const { data: searchResults = [] } = useQuery({
    queryKey: ['userSearch', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      
      // Check friendship status for each user
      const resultsWithStatus = (data || []).map((searchUser) => {
        const existing = allFriendships.find(f => 
          (f.user_id === user?.id && f.friend_id === searchUser.id) ||
          (f.user_id === searchUser.id && f.friend_id === user?.id)
        );
        
        let friendshipStatus = 'none';
        if (existing) {
          if (existing.status === 'accepted') {
            friendshipStatus = 'friends';
          } else if (existing.user_id === user?.id) {
            friendshipStatus = 'sent';
          } else {
            friendshipStatus = 'received';
          }
        }
        
        return { ...searchUser, friendshipStatus };
      });
      
      return resultsWithStatus;
    },
    enabled: searchTerm.length >= 2 && !!user,
  });

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest.mutateAsync(userId);
    setSearchTerm('');
    onOpenChange(false);
  };

  const getFriendshipBadge = (status: string) => {
    switch (status) {
      case 'friends':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Friends</Badge>;
      case 'sent':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Request Sent</Badge>;
      case 'received':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Pending Request</Badge>;
      default:
        return null;
    }
  };

  const handleViewProfile = (userId: string) => {
    onOpenChange(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-400">
            <UserPlus className="w-5 h-5" />
            Add Friend
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Search for users by username or name to send friend requests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-cyan-300">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
              <Input
                id="search"
                type="text"
                placeholder="Enter username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
              />
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((searchUser) => (
                <div key={searchUser.id} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={searchUser.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                        {searchUser.full_name ? searchUser.full_name.split(' ').map(n => n[0]).join('') : searchUser.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{searchUser.full_name || searchUser.username}</p>
                      <p className="text-sm text-slate-400">@{searchUser.username}</p>
                      {getFriendshipBadge(searchUser.friendshipStatus)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProfile(searchUser.id)}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {searchUser.friendshipStatus === 'none' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(searchUser.id)}
                        disabled={sendFriendRequest.isPending}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 && searchResults.length === 0 && (
            <p className="text-center text-slate-400 py-4">No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
