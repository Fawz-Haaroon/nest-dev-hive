
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, MessageCircle, UserPlus, Users, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useFriends } from '@/hooks/useFriends';
import { useCalls } from '@/hooks/useCalls';
import { FriendRequestModal } from '@/components/FriendRequestModal';
import { format } from 'date-fns';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, isLoading: conversationsLoading, createConversation } = useConversations();
  const { messages, isLoading: messagesLoading, sendMessage, markAsRead } = useMessages(selectedConversation);
  const { friends, pendingRequests, isLoading: friendsLoading, respondToFriendRequest } = useFriends();
  const { initiateCall } = useCalls();

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participant_1 === user?.id 
      ? conversation.participant_2_profile 
      : conversation.participant_1_profile;
    
    if (!otherParticipant) return false;
    
    return (
      otherParticipant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otherParticipant.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      await sendMessage.mutateAsync({ content: newMessage.trim() });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async (friendId: string) => {
    const conversationId = await createConversation.mutateAsync(friendId);
    setSelectedConversation(conversationId);
  };

  const handleCall = async (type: 'voice' | 'video') => {
    if (selectedConversation) {
      await initiateCall.mutateAsync({
        conversationId: selectedConversation,
        callType: type
      });
    }
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    await respondToFriendRequest.mutateAsync({ friendshipId: requestId, status: 'accepted' });
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    await respondToFriendRequest.mutateAsync({ friendshipId: requestId, status: 'blocked' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const unreadMessages = messages.filter(m => !m.read && m.sender_id !== user?.id);
      unreadMessages.forEach(message => {
        markAsRead.mutate(message.id);
      });
    }
  }, [selectedConversation, messages, user?.id, markAsRead]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Sign in to view messages
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with other developers and collaborate on projects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden h-[800px] flex">
          
          {/* Sidebar - Conversations List */}
          <div className="w-80 border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFriendRequests(!showFriendRequests)}
                    className="relative"
                  >
                    <Users className="w-4 h-4" />
                    {pendingRequests.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {pendingRequests.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddFriend(true)}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-blue-400 dark:focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            {/* Friend Requests Section */}
            {showFriendRequests && pendingRequests.length > 0 && (
              <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-blue-50/50 dark:bg-blue-950/20">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Friend Requests</h3>
                {pendingRequests.map((request) => {
                  const requester = request.user_profile;
                  return (
                    <div key={request.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={requester?.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {requester?.full_name?.[0] || requester?.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{requester?.full_name || requester?.username}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-green-600 hover:bg-green-100"
                          onClick={() => handleAcceptFriendRequest(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-600 hover:bg-red-100"
                          onClick={() => handleRejectFriendRequest(request.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Friends List (when no conversations) */}
            {filteredConversations.length === 0 && !searchTerm && (
              <div className="p-4">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Friends</h3>
                {friends.map((friend) => {
                  const friendProfile = friend.user_id === user.id ? friend.friend_profile : friend.user_profile;
                  return (
                    <button
                      key={friend.id}
                      onClick={() => handleStartConversation(friendProfile.id)}
                      className="w-full p-3 text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={friendProfile.avatar_url || ''} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {friendProfile.full_name?.split(' ').map(n => n[0]).join('') || friendProfile.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {friendProfile.full_name || friendProfile.username}
                          </h3>
                          <p className="text-sm text-slate-500">@{friendProfile.username}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participant_1 === user?.id 
                  ? conversation.participant_2_profile 
                  : conversation.participant_1_profile;
                
                const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                const unreadCount = conversation.messages?.filter(m => !m.read && m.sender_id !== user.id).length || 0;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 border-l-4 ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={otherParticipant?.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {otherParticipant?.full_name?.split(' ').map(n => n[0]).join('') || otherParticipant?.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {otherParticipant?.full_name || otherParticipant?.username}
                          </h3>
                          {lastMessage && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {format(new Date(lastMessage.created_at), 'HH:mm')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {lastMessage && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                              {lastMessage.sender_id === user.id ? 'You: ' : ''}{lastMessage.content}
                            </p>
                          )}
                          {unreadCount > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center ml-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversationData?.participant_1 === user?.id 
                          ? selectedConversationData?.participant_2_profile?.avatar_url 
                          : selectedConversationData?.participant_1_profile?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {(selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.full_name 
                            : selectedConversationData?.participant_1_profile?.full_name)?.split(' ').map(n => n[0]).join('') || 
                           (selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.username 
                            : selectedConversationData?.participant_1_profile?.username)?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.full_name || selectedConversationData?.participant_2_profile?.username
                            : selectedConversationData?.participant_1_profile?.full_name || selectedConversationData?.participant_1_profile?.username}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 w-10 p-0"
                        onClick={() => handleCall('voice')}
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 w-10 p-0"
                        onClick={() => handleCall('video')}
                      >
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                        <Info className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.sender_id === user.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {format(new Date(message.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-12 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-blue-400 dark:focus:border-blue-500 rounded-xl"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessage.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 p-0 rounded-xl shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FriendRequestModal 
        open={showAddFriend} 
        onOpenChange={setShowAddFriend} 
      />
    </div>
  );
}
