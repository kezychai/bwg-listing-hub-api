-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) NOT NULL,
  group VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  listing_type VARCHAR(50) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  size DECIMAL(10, 2),
  unit_number VARCHAR(50),
  building_name VARCHAR(255),
  description TEXT,
  amenities TEXT,
  "group" VARCHAR(50) NOT NULL,
  user_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create buyer_enquiries table
CREATE TABLE IF NOT EXISTS buyer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  property_type VARCHAR(50),
  location VARCHAR(255),
  min_price DECIMAL(15, 2),
  max_price DECIMAL(15, 2),
  bedrooms INTEGER,
  listing_type VARCHAR(50),
  notes TEXT,
  "group" VARCHAR(50),
  user_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_matches table
CREATE TABLE IF NOT EXISTS ai_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  enquiry_id UUID NOT NULL REFERENCES buyer_enquiries(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  file_path VARCHAR(500),
  media_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_listings_group ON listings("group");
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_listing_type ON listings(listing_type);
CREATE INDEX idx_buyer_enquiries_group ON buyer_enquiries("group");
CREATE INDEX idx_buyer_enquiries_location ON buyer_enquiries(location);
CREATE INDEX idx_ai_matches_listing_id ON ai_matches(listing_id);
CREATE INDEX idx_ai_matches_enquiry_id ON ai_matches(enquiry_id);
CREATE INDEX idx_ai_matches_score ON ai_matches(match_score);
CREATE INDEX idx_media_listing_id ON media(listing_id);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings (allow anonymous read)
CREATE POLICY "Allow public read access to listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert listings" ON listings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their listings" ON listings
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete their listings" ON listings
  FOR DELETE USING (true);

-- RLS Policies for buyer_enquiries
CREATE POLICY "Allow public read access to enquiries" ON buyer_enquiries
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert enquiries" ON buyer_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update enquiries" ON buyer_enquiries
  FOR UPDATE USING (true);

-- RLS Policies for ai_matches
CREATE POLICY "Allow public read access to matches" ON ai_matches
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert matches" ON ai_matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update matches" ON ai_matches
  FOR UPDATE USING (true);

-- RLS Policies for media
CREATE POLICY "Allow public read access to media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert media" ON media
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete media" ON media
  FOR DELETE USING (true);

-- Create storage bucket for photos (if not exists)
-- Note: Run this in Supabase dashboard instead
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('listing-photos', 'listing-photos', true);

-- Set storage bucket policies
-- Allow public read access
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata)
-- VALUES ('listing-photos', '.folder', 'anonymous', '{}');

-- Insert sample team members
INSERT INTO team_members (name, email, role, "group") VALUES
  ('Ali Ahmad', 'ali@bwg.com', 'agent', 'BWG'),
  ('Sarah Lee', 'sarah@bwg.com', 'agent', 'BWG'),
  ('John Smith', 'john@trr.com', 'agent', 'TRR');

-- Insert sample listings
INSERT INTO listings (
  title, listing_type, property_type, location, price, bedrooms, bathrooms, "group", description
) VALUES
  ('Luxury Apartment in Johor Bahru', 'sale', 'apartment', 'Johor Bahru', 450000, 3, 2, 'BWG', 'Beautiful 3-bedroom apartment with modern facilities'),
  ('Condo Subsale KL', 'subsale', 'condo', 'Kuala Lumpur', 350000, 2, 2, 'BWG', '2-bedroom condo with city view'),
  ('Terrace House Shah Alam', 'rent', 'terrace', 'Shah Alam', 2500, 4, 3, 'TRR', 'Spacious terrace house perfect for family');

-- Insert sample buyer enquiries
INSERT INTO buyer_enquiries (
  buyer_name, contact, property_type, location, min_price, max_price, bedrooms, listing_type, "group"
) VALUES
  ('Customer A', '0123456789', 'apartment', 'Johor Bahru', 400000, 500000, 3, 'sale', 'BWG'),
  ('Customer B', '0123456790', 'condo', 'Kuala Lumpur', 300000, 400000, 2, 'subsale', 'BWG');
