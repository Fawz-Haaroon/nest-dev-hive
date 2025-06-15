
-- Ensure our conversations table has proper foreign key constraints to profiles table
ALTER TABLE public.conversations 
DROP CONSTRAINT IF EXISTS conversations_participant_1_fkey,
DROP CONSTRAINT IF EXISTS conversations_participant_2_fkey,
DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;

-- Re-add the foreign key constraints to link to profiles table
ALTER TABLE public.conversations
ADD CONSTRAINT conversations_participant_1_fkey FOREIGN KEY (participant_1) REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_participant_2_fkey FOREIGN KEY (participant_2) REFERENCES public.profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Ensure messages table has proper foreign key to profiles
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Clean up any orphaned data that might be causing issues
DELETE FROM public.conversations WHERE participant_1 NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.conversations WHERE participant_2 NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.friends WHERE user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.friends WHERE friend_id NOT IN (SELECT id FROM public.profiles);
