
-- Create project updates table for timeline functionality
CREATE TABLE public.project_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  update_type TEXT DEFAULT 'general' CHECK (update_type IN ('general', 'milestone', 'release', 'announcement')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for project discussions
CREATE TABLE public.project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.project_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table for better skill management
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'general',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user skills junction table
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create project skills junction table
CREATE TABLE public.project_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  required_level TEXT DEFAULT 'intermediate' CHECK (required_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, skill_id)
);

-- Create reports table for moderation
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_updates
CREATE POLICY "Users can view project updates" ON public.project_updates FOR SELECT USING (true);
CREATE POLICY "Project members can create updates" ON public.project_updates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_applications pa 
    WHERE pa.project_id = project_updates.project_id 
    AND pa.applicant_id = auth.uid() 
    AND pa.status = 'approved'
  ) OR EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_updates.project_id 
    AND p.owner_id = auth.uid()
  )
);
CREATE POLICY "Authors can update their updates" ON public.project_updates FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete their updates" ON public.project_updates FOR DELETE USING (author_id = auth.uid());

-- RLS Policies for project_comments
CREATE POLICY "Users can view comments" ON public.project_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.project_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update their comments" ON public.project_comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete their comments" ON public.project_comments FOR DELETE USING (author_id = auth.uid());

-- RLS Policies for skills
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for user_skills
CREATE POLICY "Users can view all user skills" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their skills" ON public.user_skills FOR ALL USING (user_id = auth.uid());

-- RLS Policies for project_skills
CREATE POLICY "Users can view project skills" ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Project owners can manage project skills" ON public.project_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_skills.project_id AND owner_id = auth.uid())
);

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (reporter_id = auth.uid());
CREATE POLICY "Authenticated users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert some default skills
INSERT INTO public.skills (name, category, color) VALUES
('JavaScript', 'programming', '#F7DF1E'),
('TypeScript', 'programming', '#3178C6'),
('React', 'frontend', '#61DAFB'),
('Vue.js', 'frontend', '#4FC08D'),
('Angular', 'frontend', '#DD0031'),
('Node.js', 'backend', '#339933'),
('Python', 'programming', '#3776AB'),
('Java', 'programming', '#ED8B00'),
('C++', 'programming', '#00599C'),
('Go', 'programming', '#00ADD8'),
('Rust', 'programming', '#000000'),
('PHP', 'programming', '#777BB4'),
('Ruby', 'programming', '#CC342D'),
('Swift', 'programming', '#FA7343'),
('Kotlin', 'programming', '#7F52FF'),
('Flutter', 'mobile', '#02569B'),
('React Native', 'mobile', '#61DAFB'),
('iOS Development', 'mobile', '#007AFF'),
('Android Development', 'mobile', '#3DDC84'),
('MongoDB', 'database', '#47A248'),
('PostgreSQL', 'database', '#336791'),
('MySQL', 'database', '#4479A1'),
('Redis', 'database', '#DC382D'),
('Docker', 'devops', '#2496ED'),
('Kubernetes', 'devops', '#326CE5'),
('AWS', 'cloud', '#FF9900'),
('Azure', 'cloud', '#0078D4'),
('Google Cloud', 'cloud', '#4285F4'),
('GraphQL', 'api', '#E10098'),
('REST API', 'api', '#25D366'),
('Machine Learning', 'ai', '#FF6F00'),
('Data Science', 'ai', '#FF6F00'),
('UI/UX Design', 'design', '#FF7262'),
('Figma', 'design', '#F24E1E'),
('Adobe Creative Suite', 'design', '#FF0000');
