
-- Create the messages storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'messages',
  'messages', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
);

-- Create RLS policies for the messages bucket
CREATE POLICY "Users can upload files to messages bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'messages' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view files in messages bucket" ON storage.objects
FOR SELECT USING (
  bucket_id = 'messages'
);

CREATE POLICY "Users can delete their own files in messages bucket" ON storage.objects
FOR DELETE USING (
  bucket_id = 'messages' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
