const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'BWG Listing Hub API is running'
  });
});

// ============= LISTINGS ENDPOINTS =============

// Get all listings with optional filters
app.get('/api/listings', async (req, res) => {
  try {
    const { group, location, property_type, listing_type } = req.query;

    let query = supabase.from('listings').select('*');

    if (group) query = query.eq('group', group);
    if (location) query = query.eq('location', location);
    if (property_type) query = query.eq('property_type', property_type);
    if (listing_type) query = query.eq('listing_type', listing_type);

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single listing
app.get('/api/listings/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new listing
app.post('/api/listings', async (req, res) => {
  try {
    const {
      title,
      listing_type,
      property_type,
      location,
      price,
      bedrooms,
      bathrooms,
      group,
      user_id,
      description,
      amenities
    } = req.body;

    const { data, error } = await supabase
      .from('listings')
      .insert([{
        title,
        listing_type,
        property_type,
        location,
        price,
        bedrooms,
        bathrooms,
        group,
        user_id,
        description,
        amenities,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update listing
app.patch('/api/listings/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload listing photo
app.post('/api/listings/:id/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${req.params.id}/${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from('listing-photos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('listing-photos')
      .getPublicUrl(fileName);

    // Save to media table
    const { data, error } = await supabase
      .from('media')
      .insert([{
        listing_id: req.params.id,
        url: publicUrl,
        file_path: fileName,
        media_type: 'photo'
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get listing photos
app.get('/api/listings/:id/photos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('listing_id', req.params.id)
      .eq('media_type', 'photo');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= BUYER ENQUIRIES ENDPOINTS =============

// Get all buyer enquiries
app.get('/api/buyer-enquiries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('buyer_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create buyer enquiry
app.post('/api/buyer-enquiries', async (req, res) => {
  try {
    const {
      buyer_name,
      contact,
      property_type,
      location,
      min_price,
      max_price,
      bedrooms,
      listing_type,
      notes,
      group,
      user_id
    } = req.body;

    const { data, error } = await supabase
      .from('buyer_enquiries')
      .insert([{
        buyer_name,
        contact,
        property_type,
        location,
        min_price,
        max_price,
        bedrooms,
        listing_type,
        notes,
        group,
        user_id,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update buyer enquiry
app.patch('/api/buyer-enquiries/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('buyer_enquiries')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= AI MATCHES ENDPOINTS =============

// Calculate match score between listing and enquiry
function calculateMatchScore(listing, enquiry) {
  let score = 0;
  let maxScore = 100;

  // Property type match (25 points)
  if (listing.property_type === enquiry.property_type) score += 25;

  // Location match (25 points)
  if (listing.location === enquiry.location) score += 25;

  // Price match (25 points)
  if (listing.price >= enquiry.min_price && listing.price <= enquiry.max_price) {
    score += 25;
  } else if (listing.price < enquiry.min_price) {
    const diff = enquiry.min_price - listing.price;
    score += Math.max(0, 25 - (diff / 50000) * 25);
  }

  // Bedroom match (25 points)
  if (listing.bedrooms === enquiry.bedrooms) {
    score += 25;
  } else if (Math.abs(listing.bedrooms - enquiry.bedrooms) <= 1) {
    score += 15;
  }

  return Math.round((score / maxScore) * 100);
}

// Get all matches
app.get('/api/matches', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_matches')
      .select('*')
      .order('match_score', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger AI matching
app.post('/api/matches/trigger', async (req, res) => {
  try {
    // Get all listings and enquiries
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('*');

    const { data: enquiries, error: enquiriesError } = await supabase
      .from('buyer_enquiries')
      .select('*');

    if (listingsError || enquiriesError) throw listingsError || enquiriesError;

    // Calculate matches
    const matches = [];
    for (const listing of listings) {
      for (const enquiry of enquiries) {
        const score = calculateMatchScore(listing, enquiry);
        if (score >= 60) { // Only keep matches with score >= 60
          matches.push({
            listing_id: listing.id,
            enquiry_id: enquiry.id,
            match_score: score,
            match_date: new Date().toISOString(),
            notified: false
          });
        }
      }
    }

    // Insert matches
    if (matches.length > 0) {
      const { data: insertedMatches, error: insertError } = await supabase
        .from('ai_matches')
        .insert(matches)
        .select();

      if (insertError) throw insertError;
      res.status(201).json(insertedMatches);
    } else {
      res.json({ message: 'No matches found', matches: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark match as notified
app.patch('/api/matches/:id/notify', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_matches')
      .update({ notified: true, notified_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============= SERVER START =============
app.listen(PORT, () => {
  console.log(`🚀 BWG Listing Hub API running on port ${PORT}`);
  console.log(`📝 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Listings: http://localhost:${PORT}/api/listings`);
});

module.exports = app;
