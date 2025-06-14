
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useFriends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend_profile:profiles!friends_friend_id_fkey(id, username, full_name, avatar_url),
          user_profile:profiles!friends_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: allFriendships = [] } = useQuery({
    queryKey: ['allFriendships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend_profile:profiles!friends_friend_id_fkey(id, username, full_name, avatar_url),
          user_profile:profiles!friends_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Check friendship status for a user
  const checkFriendshipStatus = async (userId: string) => {
    if (!user) return 'none';
    
    const existing = allFriendships.find(f => 
      (f.user_id === user.id && f.friend_id === userId) ||
      (f.user_id === userId && f.friend_id === user.id)
    );
    
    if (!existing) return 'none';
    if (existing.status === 'accepted') return 'friends';
    if (existing.user_id === user.id) return 'sent';
    return 'received';
  };

  const sendFriendRequest = useMutation({
    mutationFn: async (friendId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if any friendship record exists
      const existing = allFriendships.find(f => 
        (f.user_id === user.id && f.friend_id === friendId) ||
        (f.user_id === friendId && f.friend_id === user.id)
      );

      if (existing) {
        if (existing.status === 'accepted') {
          throw new Error('You are already friends');
        } else if (existing.user_id === user.id) {
          throw new Error('Friend request already sent');
        } else {
          throw new Error('You have a pending friend request from this user');
        }
      }

      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['allFriendships'] });
      queryClient.invalidateQueries({ queryKey: ['userSearch'] });
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send friend request. " + error.message,
        variant: "destructive",
      });
    },
  });

  const respondToFriendRequest = useMutation({
    mutationFn: async ({ friendshipId, status }: { friendshipId: string; status: 'accepted' | 'blocked' }) => {
      const { error } = await supabase
        .from('friends')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['allFriendships'] });
      queryClient.invalidateQueries({ queryKey: ['userSearch'] });
      toast({
        title: "Friend request updated",
        description: "Friend request has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update friend request. " + error.message,
        variant: "destructive",
      });
    },
  });

  const acceptedFriends = friends;
  const pendingRequests = allFriendships.filter(f => f.status === 'pending' && f.friend_id === user?.id);
  const sentRequests = allFriendships.filter(f => f.status === 'pending' && f.user_id === user?.id);

  return {
    friends: acceptedFriends,
    pendingRequests,
    sentRequests,
    isLoading,
    sendFriendRequest,
    respondToFriendRequest,
    checkFriendshipStatus,
    allFriendships,
  };
};
