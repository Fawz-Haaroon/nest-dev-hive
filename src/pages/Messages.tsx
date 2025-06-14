
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, MessageCircle, UserPlus, Users, Check, X, ArrowLeft, Image, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useFriends } from '@/hooks/useFriends';
import { useCalls } from '@/hooks/useCalls';
import { FriendRequestModal } from '@/components/FriendRequestModal';
import { format } from 'date-fns';
import { Navbar } from '@/components/Navbar';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      try {
        await sendMessage.mutateAsync({ content: newMessage.trim() });
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async (friendId: string) => {
    try {
      const conversationId = await createConversation.mutateAsync(friendId);
      setSelectedConversation(conversationId);
      setShowMobileView(true);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
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

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && selectedConversation) {
      const file = files[0];
      
      // For now, just send a message indicating file was selected
      // TODO: Implement actual file upload to Supabase storage
      await sendMessage.mutateAsync({ 
        content: `📎 ${file.name}`,
        messageType: file.type.startsWith('image/') ? 'image' : 'file'
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign in to view messages
            </h2>
            <p className="text-slate-400">
              Connect with other developers and collaborate on projects
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
      <Navbar />
      <div className="pt-16 h-screen">
        <div className="h-full flex bg-black/20 backdrop-blur-sm">
          
          {/* Sidebar - Always visible on desktop, toggle on mobile */}
          <div className={`${showMobileView ? 'hidden' : 'block'} lg:block w-full lg:w-80 border-r border-cyan-500/20 flex flex-col bg-slate-900/50`}>
            {/* Header */}
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Messages</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFriendRequests(!showFriendRequests)}
                    className="relative text-cyan-400 hover:bg-cyan-500/10"
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
                    className="text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Friend Requests Section */}
            {showFriendRequests && pendingRequests.length > 0 && (
              <div className="p-4 border-b border-cyan-500/20 bg-blue-950/20">
                <h3 className="font-semibold text-sm text-cyan-300 mb-3">Friend Requests</h3>
                {pendingRequests.map((request) => {
                  const requester = request.user_profile;
                  return (
                    <div key={request.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={requester?.avatar_url || ''} />
                          <AvatarFallback className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                            {requester?.full_name?.[0] || requester?.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-white">{requester?.full_name || requester?.username}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-green-400 hover:bg-green-500/20"
                          onClick={() => handleAcceptFriendRequest(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/20"
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

            {/* Friends List and Conversations */}
            <div className="flex-1 overflow-y-auto">
              {/* Friends List (when no conversations or showing all friends) */}
              {(filteredConversations.length === 0 || !searchTerm) && (
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-cyan-300 mb-3">Friends</h3>
                  {friends.map((friend) => {
                    const friendProfile = friend.user_id === user.id ? friend.friend_profile : friend.user_profile;
                    return (
                      <button
                        key={friend.id}
                        onClick={() => {
                          handleStartConversation(friendProfile.id);
                        }}
                        className="w-full p-3 text-left hover:bg-cyan-500/10 transition-all duration-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={friendProfile.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold">
                              {friendProfile.full_name?.split(' ').map(n => n[0]).join('') || friendProfile.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">
                              {friendProfile.full_name || friendProfile.username}
                            </h3>
                            <p className="text-sm text-slate-400">@{friendProfile.username}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Conversations */}
              {filteredConversations.length > 0 && (
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
                        onClick={() => {
                          setSelectedConversation(conversation.id);
                          setShowMobileView(true);
                        }}
                        className={`w-full p-4 text-left hover:bg-cyan-500/10 transition-all duration-200 border-l-4 ${
                          selectedConversation === conversation.id
                            ? 'bg-cyan-950/30 border-cyan-400'
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={otherParticipant?.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold">
                              {otherParticipant?.full_name?.split(' ').map(n => n[0]).join('') || otherParticipant?.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {otherParticipant?.full_name || otherParticipant?.username}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-slate-400">
                                  {format(new Date(lastMessage.created_at), 'HH:mm')}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {lastMessage && (
                                <p className="text-sm text-slate-400 truncate">
                                  {lastMessage.sender_id === user.id ? 'You: ' : ''}{lastMessage.content}
                                </p>
                              )}
                              {unreadCount > 0 && (
                                <Badge className="bg-cyan-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center ml-2">
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
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`${showMobileView ? 'block' : 'hidden'} lg:block flex-1 flex flex-col bg-gradient-to-b from-slate-900/30 to-slate-800/20`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-cyan-500/20 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden text-cyan-400"
                        onClick={() => setShowMobileView(false)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversationData?.participant_1 === user?.id 
                          ? selectedConversationData?.participant_2_profile?.avatar_url 
                          : selectedConversationData?.participant_1_profile?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold">
                          {(selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.full_name 
                            : selectedConversationData?.participant_1_profile?.full_name)?.split(' ').map(n => n[0]).join('') || 
                           (selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.username 
                            : selectedConversationData?.participant_1_profile?.username)?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h2 className="font-semibold text-white">
                          {selectedConversationData?.participant_1 === user?.id 
                            ? selectedConversationData?.participant_2_profile?.full_name || selectedConversationData?.participant_2_profile?.username
                            : selectedConversationData?.participant_1_profile?.full_name || selectedConversationData?.participant_1_profile?.username}
                        </h2>
                        <p className="text-sm text-green-400">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 w-10 p-0 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={() => handleCall('voice')}
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-10 w-10 p-0 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={() => handleCall('video')}
                      >
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-cyan-400 hover:bg-cyan-500/20">
                        <Info className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-cyan-400 hover:bg-cyan-500/20">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-900/20 to-slate-800/20">
                  {messagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                        <p className="text-cyan-300">Start a conversation!</p>
                        <p className="text-slate-400 text-sm">Send your first message below</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.sender_id === user.id
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                              : 'bg-slate-800/80 text-white border border-slate-700/50'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user.id ? 'text-cyan-100' : 'text-slate-400'
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
                <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50">
                  <div className="flex items-end gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-10 w-10 p-0 shrink-0 text-cyan-400 hover:bg-cyan-500/20"
                      onClick={handleFileAttachment}
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-12 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-cyan-400 hover:bg-cyan-500/20">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessage.isPending}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white h-10 w-10 p-0 rounded-xl shrink-0"
                    >
                      {sendMessage.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900/20 to-slate-800/20">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-400">
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
