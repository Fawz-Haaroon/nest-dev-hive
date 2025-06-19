
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  category: string;
  color: string;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  skill?: Skill;
}

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useUserSkills = (userId?: string) => {
  return useQuery({
    queryKey: ['user-skills', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills:skill_id (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map(userSkill => ({
        ...userSkill,
        skill: userSkill.skills
      })) as UserSkill[];
    },
    enabled: !!userId,
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (skillData: { skill_id: string; proficiency_level: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_skills')
        .insert([{ 
          ...skillData,
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-skills'] });
      toast({
        title: 'Success',
        description: 'Skill added successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
