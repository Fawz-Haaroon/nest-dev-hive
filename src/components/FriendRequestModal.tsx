
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

interface FriendRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FriendRequestModal = ({ open, onOpenChange }: FriendRequestModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { sendFriendRequest, checkFriendshipStatus } = useFriends();

  const { data: searchResults = [] } = useQuery({
    queryKey: ['userSearch', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      
      // Check friendship status for each user
      const resultsWithStatus = await Promise.all(
        (data || []).map(async (user) => {
          const status = await checkFriendshipStatus(user.id);
          return { ...user, friendshipStatus: status };
        })
      );
      
      return resultsWithStatus;
    },
    enabled: searchTerm.length >= 2,
  });

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest.mutateAsync(userId);
    setSearchTerm('');
    onOpenChange(false);
  };

  const getFriendshipBadge = (status: string) => {
    switch (status) {
      case 'friends':
        return <Badge className="bg-green-100 text-green-800">Friends</Badge>;
      case 'sent':
        return <Badge className="bg-yellow-100 text-yellow-800">Request Sent</Badge>;
      case 'received':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Friend
          </DialogTitle>
          <DialogDescription>
            Search for users by username or name to send friend requests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="search"
                type="text"
                placeholder="Enter username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name || user.username}</p>
                      <p className="text-sm text-slate-500">@{user.username}</p>
                      {getFriendshipBadge(user.friendshipStatus)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {user.friendshipStatus === 'none' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendFriendRequest.isPending}
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
            <p className="text-center text-slate-500 py-4">No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
