
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: 'Alex Chen',
      avatar: '/placeholder.svg',
      lastMessage: 'Looking forward to collaborating on the React project!',
      time: '2m ago',
      unread: 2,
      online: true,
      project: 'E-commerce Platform'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      lastMessage: 'Can we schedule a call to discuss the AI model?',
      time: '1h ago',
      unread: 0,
      online: true,
      project: 'AI Chat Assistant'
    },
    {
      id: 3,
      name: 'Dev Team',
      avatar: '/placeholder.svg',
      lastMessage: 'Great progress on the mobile app this week!',
      time: '3h ago',
      unread: 5,
      online: false,
      project: 'Mobile Fitness App',
      isGroup: true
    },
    {
      id: 4,
      name: 'Maya Patel',
      avatar: '/placeholder.svg',
      lastMessage: 'The design mockups look amazing 🎨',
      time: '1d ago',
      unread: 0,
      online: false,
      project: 'Design System'
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: 'Alex Chen',
      content: 'Hey! I saw your project on ProjectNest. The e-commerce platform looks really interesting!',
      time: '10:30 AM',
      isOwnMessage: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks! I\'d love to have you join the team. Your React expertise would be perfect for this project.',
      time: '10:32 AM',
      isOwnMessage: true
    },
    {
      id: 3,
      sender: 'Alex Chen',
      content: 'Absolutely! I\'ve been working with React for 3 years and have experience with Next.js and TypeScript.',
      time: '10:35 AM',
      isOwnMessage: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'Perfect! When would be a good time for a quick call to discuss the project scope?',
      time: '10:37 AM',
      isOwnMessage: true
    },
    {
      id: 5,
      sender: 'Alex Chen',
      content: 'Looking forward to collaborating on the React project!',
      time: '10:45 AM',
      isOwnMessage: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Please sign in to access messages
            </h1>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/40">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h2>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-slate-100/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 rounded-xl"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 ${
                      selectedChat === conversation.id ? 'bg-blue-50/60 dark:bg-blue-950/30 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {conversation.name}
                            {conversation.isGroup && (
                              <Badge variant="secondary" className="ml-2 text-xs">Group</Badge>
                            )}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{conversation.time}</span>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {conversation.project}
                          </Badge>
                          {conversation.unread > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedConversation.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedConversation.project}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        msg.isOwnMessage
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isOwnMessage ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-100/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
