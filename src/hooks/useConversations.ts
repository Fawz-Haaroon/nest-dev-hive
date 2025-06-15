
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export const useConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching conversations for user:', user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!conversations_participant_1_fkey(id, username, full_name, avatar_url),
          participant_2_profile:profiles!conversations_participant_2_fkey(id, username, full_name, avatar_url),
          messages(id, content, created_at, sender_id, read)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
      
      console.log('Conversations fetched:', data);
      return data || [];
    },
    enabled: !!user,
  });

  const createConversation = useMutation({
    mutationFn: async (participantId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      console.log('Creating conversation between:', user.id, 'and', participantId);
      
      // Check if conversation already exists (both directions due to unique constraint)
      const { data: existing, error: existingError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${participantId}),and(participant_1.eq.${participantId},participant_2.eq.${user.id})`)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking existing conversation:', existingError);
        throw existingError;
      }

      if (existing) {
        console.log('Found existing conversation:', existing.id);
        return existing.id;
      }

      // Create new conversation - always put current user as participant_1
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: participantId
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }
      
      console.log('Successfully created conversation:', data.id);
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Set up real-time subscription for conversations
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for conversations');

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_1=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time conversation change (participant_1):', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_2=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time conversation change (participant_2):', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up conversations real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    conversations,
    isLoading,
    createConversation,
  };
};
