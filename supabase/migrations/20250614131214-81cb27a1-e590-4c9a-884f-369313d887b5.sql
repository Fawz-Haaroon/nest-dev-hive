
-- Fix foreign key references in friends table to point to profiles instead of auth.users
ALTER TABLE public.friends 
DROP CONSTRAINT IF EXISTS friends_user_id_fkey,
DROP CONSTRAINT IF EXISTS friends_friend_id_fkey;

-- Add correct foreign key constraints
ALTER TABLE public.friends 
ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix foreign key references in other tables to use profiles
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_participant_1_fkey,
DROP CONSTRAINT IF EXISTS conversations_participant_2_fkey,
DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;

ALTER TABLE public.conversations
ADD CONSTRAINT conversations_participant_1_fkey FOREIGN KEY (participant_1) REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_participant_2_fkey FOREIGN KEY (participant_2) REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.conversation_participants
DROP CONSTRAINT IF EXISTS conversation_participants_user_id_fkey;

ALTER TABLE public.conversation_participants
ADD CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.message_status
DROP CONSTRAINT IF EXISTS message_status_user_id_fkey;

ALTER TABLE public.message_status
ADD CONSTRAINT message_status_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.calls
DROP CONSTRAINT IF EXISTS calls_caller_id_fkey;

ALTER TABLE public.calls
ADD CONSTRAINT calls_caller_id_fkey FOREIGN KEY (caller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
