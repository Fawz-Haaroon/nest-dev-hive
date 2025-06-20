
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectNew {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  owner_id: string;
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  tech_stack: string[];
  category: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  max_members: number;
  current_members: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useProjectsNew = (filters?: {
  category?: string;
  tags?: string[];
  difficulty?: string;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['projects-new', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          detailed_description,
          owner_id,
          status,
          difficulty,
          tags,
          tech_stack,
          category,
          repository_url,
          live_demo_url,
          image_url,
          max_members,
          featured,
          created_at,
          updated_at,
          project_members!inner(count)
        `)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        detailed_description: project.detailed_description,
        owner_id: project.owner_id,
        status: project.status as 'open' | 'in-progress' | 'completed' | 'closed',
        difficulty: project.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        tags: project.tags || [],
        tech_stack: project.tech_stack || [],
        category: project.category || '',
        github_url: project.repository_url,
        live_url: project.live_demo_url,
        image_url: project.image_url,
        max_members: project.max_members || 5,
        current_members: project.project_members?.length || 1,
        featured: project.featured || false,
        created_at: project.created_at,
        updated_at: project.updated_at
      })) as ProjectNew[];
    },
  });
};

export const useCreateProjectNew = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: Omit<ProjectNew, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          title: projectData.title,
          description: projectData.description,
          detailed_description: projectData.detailed_description,
          status: projectData.status,
          difficulty: projectData.difficulty,
          tags: projectData.tags,
          tech_stack: projectData.tech_stack,
          category: projectData.category,
          repository_url: projectData.github_url,
          live_demo_url: projectData.live_url,
          image_url: projectData.image_url,
          max_members: projectData.max_members,
          featured: projectData.featured,
          owner_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-new'] });
      toast({
        title: 'Success',
        description: 'Project created successfully!',
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
