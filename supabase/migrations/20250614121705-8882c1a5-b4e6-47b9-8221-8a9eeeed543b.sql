
-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN category text,
ADD COLUMN featured boolean DEFAULT false;

-- We'll calculate current_members from project_members table, so no need to add it as a column
