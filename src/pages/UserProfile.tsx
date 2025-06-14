
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFriends } from '@/hooks/useFriends';
import { Navbar } from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, UserMinus, MessageCircle, MapPin, Calendar, Github, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { sendFriendRequest, respondToFriendRequest, checkFriendshipStatus, allFriendships } = useFriends();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get friendship status
  const friendshipStatus = allFriendships.find(f => 
    (f.user_id === user?.id && f.friend_id === userId) ||
    (f.user_id === userId && f.friend_id === user?.id)
  );

  const removeFriend = useMutation({
    mutationFn: async () => {
      if (!friendshipStatus) throw new Error('No friendship found');
      
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipStatus.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['allFriendships'] });
      toast({
        title: "Friend removed",
        description: "Friend has been removed successfully.",
      });
    },
  });

  const handleAddFriend = async () => {
    if (!userId) return;
    await sendFriendRequest.mutateAsync(userId);
  };

  const handleRemoveFriend = async () => {
    await removeFriend.mutateAsync();
  };

  const handleAcceptRequest = async () => {
    if (!friendshipStatus) return;
    await respondToFriendRequest.mutateAsync({ 
      friendshipId: friendshipStatus.id, 
      status: 'accepted' 
    });
  };

  const handleMessage = () => {
    navigate('/messages');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getFriendshipButton = () => {
    if (!user || user.id === userId) return null;

    if (!friendshipStatus) {
      return (
        <Button
          onClick={handleAddFriend}
          disabled={sendFriendRequest.isPending}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      );
    }

    if (friendshipStatus.status === 'accepted') {
      return (
        <Button
          onClick={handleRemoveFriend}
          disabled={removeFriend.isPending}
          variant="destructive"
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Remove Friend
        </Button>
      );
    }

    if (friendshipStatus.status === 'pending') {
      if (friendshipStatus.user_id === user.id) {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Request Sent
          </Badge>
        );
      } else {
        return (
          <Button
            onClick={handleAcceptRequest}
            disabled={respondToFriendRequest.isPending}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Accept Request
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl font-bold">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2">
                    {profile.full_name || profile.username}
                  </CardTitle>
                  <p className="text-cyan-400 mb-4">@{profile.username}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {getFriendshipButton()}
                    {user && user.id !== userId && (
                      <Button
                        onClick={handleMessage}
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-slate-300">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                  <div className="space-y-2">
                    {profile.location && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                  <div className="space-y-2">
                    {profile.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile.website_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
