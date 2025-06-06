-- Create listings table with proper structure
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  condition VARCHAR(50) NOT NULL,
  year VARCHAR(4),
  brand VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for camera images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('camera-images', 'camera-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to listings" ON listings
  FOR SELECT USING (true);

-- Create policies for admin operations (you can modify these based on your auth setup)
CREATE POLICY "Allow all operations for authenticated users" ON listings
  FOR ALL USING (true);

-- Storage policies for images
CREATE POLICY "Allow public read access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'camera-images');

CREATE POLICY "Allow public upload to images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'camera-images');

CREATE POLICY "Allow public update to images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'camera-images');

CREATE POLICY "Allow public delete to images" ON storage.objects
  FOR DELETE USING (bucket_id = 'camera-images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand);
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);

-- Insert some sample data for testing
INSERT INTO listings (title, description, price, images, condition, year, brand) VALUES
('Canon AE-1 Program', 'Classic 35mm SLR camera in excellent condition. Perfect for film photography enthusiasts. This camera has been well-maintained and comes with original leather case.', 1100.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Excellent', '1981', 'Canon'),
('Nikon FM2', 'Professional mechanical SLR camera. Built like a tank and ready for any adventure. Features manual focus and exposure control for the purist photographer.', 1650.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Very Good', '1982', 'Nikon'),
('Pentax K1000', 'The legendary student camera that taught millions how to shoot. Simple, reliable, and perfect for learning photography fundamentals.', 850.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Good', '1976', 'Pentax'),
('Olympus OM-1', 'Compact and lightweight 35mm SLR with exceptional build quality. Known for its bright viewfinder and precise metering system.', 950.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Excellent', '1972', 'Olympus'),
('Leica M3', 'The holy grail of rangefinder cameras. Exceptional German engineering and timeless design. A true collector''s piece.', 4500.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Very Good', '1954', 'Leica'),
('Hasselblad 500CM', 'Medium format perfection. Used by NASA and professional photographers worldwide. Includes 80mm Planar lens.', 2800.00, ARRAY['/placeholder.svg?height=400&width=400'], 'Excellent', '1970', 'Hasselblad')
ON CONFLICT DO NOTHING;
