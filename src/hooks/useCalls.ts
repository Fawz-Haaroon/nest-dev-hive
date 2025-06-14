
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useCalls = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const initiateCall = useMutation({
    mutationFn: async ({ conversationId, callType }: { conversationId: string; callType: 'voice' | 'video' }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('calls')
        .insert({
          conversation_id: conversationId,
          caller_id: user.id,
          call_type: callType,
          status: 'initiated'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (call) => {
      toast({
        title: `${call.call_type === 'voice' ? 'Voice' : 'Video'} call initiated`,
        description: "Connecting...",
      });
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
    onError: (error) => {
      toast({
        title: "Call failed",
        description: "Unable to initiate call. " + error.message,
        variant: "destructive",
      });
    },
  });

  const endCall = useMutation({
    mutationFn: async (callId: string) => {
      const endTime = new Date().toISOString();
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'ended',
          ended_at: endTime
        })
        .eq('id', callId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
  });

  return {
    initiateCall,
    endCall,
  };
};
