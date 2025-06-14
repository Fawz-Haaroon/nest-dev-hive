import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      participant: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: '/placeholder.svg',
        online: true
      },
      lastMessage: {
        content: 'Hey! I saw your React project. Would love to collaborate!',
        timestamp: '2 min ago',
        unread: true
      },
      project: 'E-commerce Platform'
    },
    {
      id: '2',
      participant: {
        name: 'Alex Rodriguez',
        username: 'alexrod',
        avatar: '/placeholder.svg',
        online: false
      },
      lastMessage: {
        content: 'Perfect! Let\'s schedule a call to discuss the API design.',
        timestamp: '1 hour ago',
        unread: false
      },
      project: 'Task Management App'
    },
    {
      id: '3',
      participant: {
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: '/placeholder.svg',
        online: true
      },
      lastMessage: {
        content: 'Thanks for the code review! I\'ve made the changes.',
        timestamp: '3 hours ago',
        unread: true
      },
      project: 'Weather Dashboard'
    }
  ];

  // Mock messages for selected conversation
  const messages = selectedConversation ? [
    {
      id: '1',
      senderId: selectedConversation === '1' ? 'other' : 'me',
      content: 'Hey! I saw your React project. Would love to collaborate!',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      content: 'That sounds great! What specific part are you interested in working on?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: '3',
      senderId: selectedConversation === '1' ? 'other' : 'me',
      content: 'I\'d love to help with the frontend components and the user authentication system.',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Perfect! Let me add you to the project repository.',
      timestamp: '10:37 AM',
      type: 'text'
    }
  ] : [];

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Messages</h1>
              
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

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
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
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {conversation.lastMessage.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {conversation.project}
                        </span>
                        {conversation.lastMessage.unread && (
                          <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            !
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
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
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversationData?.participant.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {selectedConversationData?.participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversationData?.participant.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedConversationData?.participant.name}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedConversationData?.participant.online ? 'Online' : 'Last seen 2 hours ago'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
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
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      disabled={!newMessage.trim()}
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
    </div>
  );
}
