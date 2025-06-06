-- Create storage bucket for camera images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'camera-images', 
  'camera-images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up storage policies
CREATE POLICY "Allow public read access to camera images" ON storage.objects
  FOR SELECT USING (bucket_id = 'camera-images');

CREATE POLICY "Allow public upload to camera images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'camera-images' 
    AND (storage.foldername(name))[1] = 'uploads'
  );

CREATE POLICY "Allow public update to camera images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'camera-images');

CREATE POLICY "Allow public delete to camera images" ON storage.objects
  FOR DELETE USING (bucket_id = 'camera-images');
