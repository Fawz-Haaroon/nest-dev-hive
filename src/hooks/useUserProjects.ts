
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProject {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  status: 'open' | 'in_progress' | 'completed' | 'paused';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  tech_stack: string[];
  repository_url?: string;
  live_demo_url?: string;
  max_members: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  role: 'owner' | 'member';
  joined_at?: string;
}

export const useUserProjects = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get projects owned by the user
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Get projects where user is a member (through approved applications)
      const { data: memberProjects, error: memberError } = await supabase
        .from('projects')
        .select(`
          *,
          project_applications!inner(
            status,
            created_at
          )
        `)
        .eq('project_applications.applicant_id', user.id)
        .eq('project_applications.status', 'approved')
        .neq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (memberError) throw memberError;

      // Format owned projects
      const formattedOwnedProjects: UserProject[] = (ownedProjects || []).map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        detailed_description: project.detailed_description,
        status: project.status as 'open' | 'in_progress' | 'completed' | 'paused',
        difficulty: project.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        tags: project.tags || [],
        tech_stack: project.tech_stack || [],
        repository_url: project.repository_url,
        live_demo_url: project.live_demo_url,
        max_members: project.max_members || 5,
        image_url: project.image_url,
        created_at: project.created_at,
        updated_at: project.updated_at,
        role: 'owner' as const,
      }));

      // Format member projects
      const formattedMemberProjects: UserProject[] = (memberProjects || []).map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        detailed_description: project.detailed_description,
        status: project.status as 'open' | 'in_progress' | 'completed' | 'paused',
        difficulty: project.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        tags: project.tags || [],
        tech_stack: project.tech_stack || [],
        repository_url: project.repository_url,
        live_demo_url: project.live_demo_url,
        max_members: project.max_members || 5,
        image_url: project.image_url,
        created_at: project.created_at,
        updated_at: project.updated_at,
        role: 'member' as const,
        joined_at: project.project_applications?.[0]?.created_at,
      }));

      // Combine and sort all projects by most recent activity
      const allProjects = [...formattedOwnedProjects, ...formattedMemberProjects];
      return allProjects.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    },
    enabled: !!user,
  });
};
