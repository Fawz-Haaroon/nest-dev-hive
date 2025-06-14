
-- Add media attachments to projects
ALTER TABLE public.projects 
ADD COLUMN media_urls JSONB DEFAULT '[]',
ADD COLUMN video_url TEXT,
ADD COLUMN demo_images TEXT[] DEFAULT '{}';

-- Create favorites table
CREATE TABLE public.project_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create messages/chat system
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend profiles with more fields
ALTER TABLE public.profiles 
ADD COLUMN age INTEGER,
ADD COLUMN role TEXT,
ADD COLUMN country TEXT,
ADD COLUMN city TEXT,
ADD COLUMN coding_platforms JSONB DEFAULT '{}',
ADD COLUMN social_media JSONB DEFAULT '{}',
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN is_profile_public BOOLEAN DEFAULT TRUE;

-- Add RLS policies for new tables
ALTER TABLE public.project_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view all favorites" ON public.project_favorites FOR SELECT USING (true);
CREATE POLICY "Users can manage own favorites" ON public.project_favorites FOR ALL USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
  )
);
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id 
    AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
  )
);

-- Update projects view to include favorites
DROP VIEW IF EXISTS public.projects_with_stats;
CREATE OR REPLACE VIEW public.projects_with_stats AS
SELECT 
  p.*,
  pr.username as owner_username,
  pr.full_name as owner_full_name,
  pr.avatar_url as owner_avatar_url,
  COALESCE(member_count.count, 0) as member_count,
  COALESCE(vote_count.count, 0) as upvotes,
  COALESCE(favorite_count.count, 0) as favorites
FROM public.projects p
LEFT JOIN public.profiles pr ON p.owner_id = pr.id
LEFT JOIN (
  SELECT project_id, COUNT(*) as count 
  FROM public.project_members 
  GROUP BY project_id
) member_count ON p.id = member_count.project_id
LEFT JOIN (
  SELECT project_id, COUNT(*) as count 
  FROM public.project_votes 
  GROUP BY project_id
) vote_count ON p.id = vote_count.project_id
LEFT JOIN (
  SELECT project_id, COUNT(*) as count 
  FROM public.project_favorites 
  GROUP BY project_id
) favorite_count ON p.id = favorite_count.project_id;

-- Function to search projects
CREATE OR REPLACE FUNCTION public.search_projects(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  tags TEXT[],
  tech_stack TEXT[],
  owner_username TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.tags,
    p.tech_stack,
    pr.username,
    GREATEST(
      similarity(p.title, search_term),
      similarity(p.description, search_term),
      similarity(array_to_string(p.tags, ' '), search_term),
      similarity(array_to_string(p.tech_stack, ' '), search_term)
    ) as sim
  FROM public.projects p
  LEFT JOIN public.profiles pr ON p.owner_id = pr.id
  WHERE 
    p.title ILIKE '%' || search_term || '%' OR
    p.description ILIKE '%' || search_term || '%' OR
    EXISTS (SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE '%' || search_term || '%') OR
    EXISTS (SELECT 1 FROM unnest(p.tech_stack) tech WHERE tech ILIKE '%' || search_term || '%')
  ORDER BY sim DESC, p.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
