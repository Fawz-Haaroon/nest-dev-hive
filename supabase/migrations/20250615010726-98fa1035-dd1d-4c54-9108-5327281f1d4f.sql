
-- Drop all existing messaging-related tables to start fresh
DROP TABLE IF EXISTS public.message_status CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.calls CASCADE;
DROP TABLE IF EXISTS public.conversation_participants CASCADE;

-- Create a simple, clean conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_conversation UNIQUE(participant_1, participant_2),
  CONSTRAINT no_self_conversation CHECK (participant_1 != participant_2)
);

-- Create a simple messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations
FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

CREATE POLICY "Users can create conversations" ON public.conversations
FOR INSERT WITH CHECK (
  auth.uid() = participant_1
);

-- Simple RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
  )
);

CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
  )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
