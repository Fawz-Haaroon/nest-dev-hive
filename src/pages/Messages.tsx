import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, ArrowLeft, UserPlus, Users, Check, X, MoreHorizontal, MessageCircle, Paperclip } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useFriends } from '@/hooks/useFriends';
import { useUserPresence } from '@/hooks/useUserPresence';
import { FriendRequestModal } from '@/components/FriendRequestModal';
import { format } from 'date-fns';
import { Navbar } from '@/components/Navbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface MessageWithSender {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  file_url?: string;
  sender: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export default function Messages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  const [showFriendsView, setShowFriendsView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { conversations, isLoading: conversationsLoading, createConversation } = useConversations();
  const { messages, isLoading: messagesLoading, sendMessage } = useMessages(selectedConversation);
  const { friends, pendingRequests, isLoading: friendsLoading, respondToFriendRequest } = useFriends();
  const { isUserOnline } = useUserPresence();

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const deleteConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setSelectedConversation(null);
      setShowMobileView(false);
      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted successfully.",
      });
    },
  });

  // Enhanced search functionality
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    
    const otherParticipant = conversation.participant_1 === user?.id 
      ? conversation.participant_2_profile 
      : conversation.participant_1_profile;
    
    if (!otherParticipant) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      otherParticipant.full_name?.toLowerCase().includes(searchLower) ||
      otherParticipant.username.toLowerCase().includes(searchLower)
    );
  });

  const filteredFriends = friends.filter(friend => {
    if (!searchTerm) return true;
    
    const friendProfile = friend.user_id === user?.id ? friend.friend_profile : friend.user_profile;
    if (!friendProfile) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      friendProfile.full_name?.toLowerCase().includes(searchLower) ||
      friendProfile.username.toLowerCase().includes(searchLower)
    );
  });

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        await sendMessage.mutateAsync({ content: newMessage.trim() });
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedConversation) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('messages')
        .getPublicUrl(filePath);

      await sendMessage.mutateAsync({ 
        content: `📎 ${file.name}`,
        fileUrl: data.publicUrl,
        fileName: file.name 
      });

      toast({
        title: "File sent",
        description: "Your file has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast({
        title: "Error",
        description: `Failed to upload file: ${error.message}`,
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      setShowFriendsView(false);
      toast({
        title: "Success",
        description: "Conversation started successfully!",
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast({
        title: "Error",
        description: `Failed to start conversation: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      await respondToFriendRequest.mutateAsync({ friendshipId: requestId, status: 'accepted' });
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    try {
      await respondToFriendRequest.mutateAsync({ friendshipId: requestId, status: 'blocked' });
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation.mutateAsync(conversationId);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setSelectedConversation(conversationId);
    setShowMobileView(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-screen">
          <div className="text-center">
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
      <div className="pt-16 h-screen flex">
        <ResizablePanelGroup direction="horizontal" className="h-full bg-black/20 backdrop-blur-sm w-full">
          
          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className={`${showMobileView ? 'hidden' : 'block'} lg:block border-r border-cyan-500/20 flex flex-col bg-slate-900/50`}>
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
              
              {/* Tab buttons */}
              <div className="flex gap-1 mb-4">
                <Button
                  variant={!showFriendsView ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowFriendsView(false)}
                  className={!showFriendsView ? "bg-cyan-500 text-white" : "text-cyan-400 hover:bg-cyan-500/10"}
                >
                  Conversations
                </Button>
                <Button
                  variant={showFriendsView ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowFriendsView(true)}
                  className={showFriendsView ? "bg-cyan-500 text-white" : "text-cyan-400 hover:bg-cyan-500/10"}
                >
                  Friends
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={showFriendsView ? "Search friends..." : "Search conversations..."}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {showFriendsView ? (
                // Friends View
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-cyan-300 mb-3">All Friends</h3>
                  {filteredFriends.map((friend) => {
                    const friendProfile = friend.user_id === user.id ? friend.friend_profile : friend.user_profile;
                    const isOnline = isUserOnline(friendProfile.id);
                    
                    return (
                      <div
                        key={friend.id}
                        className="p-3 hover:bg-cyan-500/10 transition-all duration-200 rounded-lg mb-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={friendProfile.avatar_url || ''} />
                              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold">
                                {friendProfile.full_name?.split(' ').map(n => n[0]).join('') || friendProfile.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-900 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">
                              {friendProfile.full_name || friendProfile.username}
                            </h3>
                            <p className="text-sm text-slate-400 truncate">@{friendProfile.username}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cyan-400 hover:bg-cyan-500/20"
                            onClick={() => handleStartConversation(friendProfile.id)}
                            disabled={createConversation.isPending}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Conversations View
                filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participant_1 === user?.id 
                      ? conversation.participant_2_profile 
                      : conversation.participant_1_profile;
                    
                    const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                    const isOnline = isUserOnline(otherParticipant?.id || '');

                    return (
                      <div
                        key={conversation.id}
                        className={`relative group p-4 hover:bg-cyan-500/10 transition-all duration-200 border-l-4 cursor-pointer ${
                          selectedConversation === conversation.id
                            ? 'bg-cyan-950/30 border-cyan-400'
                            : 'border-transparent'
                        }`}
                        onClick={() => handleSelectConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={otherParticipant?.avatar_url || ''} />
                              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold">
                                {otherParticipant?.full_name?.split(' ').map(n => n[0]).join('') || otherParticipant?.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-900 rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {(otherParticipant?.full_name || otherParticipant?.username || '').length > 20 
                                  ? `${(otherParticipant?.full_name || otherParticipant?.username || '').substring(0, 20)}...`
                                  : otherParticipant?.full_name || otherParticipant?.username}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                                  {format(new Date(lastMessage.created_at), 'HH:mm')}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {lastMessage && (
                                <p className="text-sm text-slate-400 truncate">
                                  {lastMessage.sender_id === user.id ? 'You: ' : ''}{lastMessage.content.length > 20 ? `${lastMessage.content.substring(0, 20)}...` : lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white h-6 w-6 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-600">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteConversation(conversation.id);
                                  }}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  Delete Conversation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-slate-400">No conversations yet</p>
                    <p className="text-sm text-slate-500">Start messaging your friends!</p>
                  </div>
                )
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Chat Area */}
          <ResizablePanel defaultSize={75} className={`${showMobileView ? 'block' : 'hidden'} lg:block`}>
            {selectedConversation ? (
              <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/30 to-slate-800/20">
                {/* Chat Header */}
                <div className="p-4 border-b border-cyan-500/20 bg-slate-900/50 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden text-cyan-400"
                      onClick={() => setShowMobileView(false)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="relative">
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
                      {isUserOnline(selectedConversationData?.participant_1 === user?.id 
                        ? selectedConversationData?.participant_2_profile?.id || ''
                        : selectedConversationData?.participant_1_profile?.id || '') && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-900 rounded-full"></div>
                      )}
                    </div>
                    
                    <div>
                      <h2 className="font-semibold text-white">
                        {selectedConversationData?.participant_1 === user?.id 
                          ? selectedConversationData?.participant_2_profile?.full_name || selectedConversationData?.participant_2_profile?.username
                          : selectedConversationData?.participant_1_profile?.full_name || selectedConversationData?.participant_1_profile?.username}
                      </h2>
                      <p className={`text-sm ${isUserOnline(selectedConversationData?.participant_1 === user?.id 
                        ? selectedConversationData?.participant_2_profile?.id || ''
                        : selectedConversationData?.participant_1_profile?.id || '') ? 'text-green-400' : 'text-slate-400'}`}>
                        {isUserOnline(selectedConversationData?.participant_1 === user?.id 
                          ? selectedConversationData?.participant_2_profile?.id || ''
                          : selectedConversationData?.participant_1_profile?.id || '') ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {messagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center">
                        <p className="text-cyan-300">Start a conversation!</p>
                        <p className="text-slate-400 text-sm">Send your first message below</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message: MessageWithSender) => (
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
                          {message.file_url && (
                            <a 
                              href={message.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block mt-2 text-sm underline hover:no-underline"
                            >
                              View attachment
                            </a>
                          )}
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
                <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50 flex-shrink-0">
                  <div className="flex items-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-cyan-400 hover:bg-cyan-500/10 h-10 w-10 p-0 shrink-0"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                      />
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
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-b from-slate-900/30 to-slate-800/20">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-400">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <FriendRequestModal 
        open={showAddFriend} 
        onOpenChange={setShowAddFriend} 
      />
    </div>
  );
}
