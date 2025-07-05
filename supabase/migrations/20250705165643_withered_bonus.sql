/*
  # Dragon Database System

  1. New Tables
    - `dragon_species` - Core dragon species information
    - `dragon_classes` - Dragon classification system
    - `dragon_abilities` - Individual dragon abilities
    - `dragon_stats` - Combat and behavioral statistics
    - `dragon_individuals` - Specific named dragons
    - `dragon_relationships` - Relationships between dragons
    - `dragon_locations` - Where dragons have been seen
    - `user_dragon_favorites` - User's favorite dragons

  2. Security
    - Enable RLS on all tables
    - Public read access for dragon data
    - Admin-only write access for dragon data
    - User-specific access for favorites

  3. Features
    - Comprehensive dragon information system
    - User favorites and collections
    - Search and filtering capabilities
    - Relationship tracking between dragons
*/

-- Create dragon classes table
CREATE TABLE IF NOT EXISTS dragon_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  characteristics TEXT[],
  color_code TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dragon species table
CREATE TABLE IF NOT EXISTS dragon_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  class_id UUID NOT NULL REFERENCES dragon_classes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  lore TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary', 'mythical')),
  size_category TEXT NOT NULL CHECK (size_category IN ('tiny', 'small', 'medium', 'large', 'huge', 'colossal')),
  habitat TEXT[],
  diet TEXT NOT NULL,
  temperament TEXT NOT NULL,
  intelligence_level TEXT NOT NULL CHECK (intelligence_level IN ('low', 'medium', 'high', 'exceptional')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dragon abilities table
CREATE TABLE IF NOT EXISTS dragon_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES dragon_species(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  ability_type TEXT NOT NULL CHECK (ability_type IN ('breath_weapon', 'physical', 'magical', 'special')),
  power_level INTEGER CHECK (power_level >= 1 AND power_level <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dragon stats table
CREATE TABLE IF NOT EXISTS dragon_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES dragon_species(id) ON DELETE CASCADE,
  firepower INTEGER DEFAULT 0 CHECK (firepower >= 0 AND firepower <= 10),
  speed INTEGER DEFAULT 0 CHECK (speed >= 0 AND speed <= 10),
  armor INTEGER DEFAULT 0 CHECK (armor >= 0 AND armor <= 10),
  stealth INTEGER DEFAULT 0 CHECK (stealth >= 0 AND stealth <= 10),
  venom INTEGER DEFAULT 0 CHECK (venom >= 0 AND venom <= 10),
  jaw_strength INTEGER DEFAULT 0 CHECK (jaw_strength >= 0 AND jaw_strength <= 10),
  wing_span_meters DECIMAL(5,2),
  length_meters DECIMAL(5,2),
  weight_kg DECIMAL(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dragon individuals table (named dragons like Toothless)
CREATE TABLE IF NOT EXISTS dragon_individuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species_id UUID NOT NULL REFERENCES dragon_species(id) ON DELETE CASCADE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'alive' CHECK (status IN ('alive', 'deceased', 'missing', 'unknown')),
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  age_category TEXT CHECK (age_category IN ('hatchling', 'juvenile', 'adult', 'elder', 'ancient')),
  rider_name TEXT,
  location TEXT,
  first_appearance TEXT,
  special_traits TEXT[],
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dragon relationships table
CREATE TABLE IF NOT EXISTS dragon_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dragon1_id UUID NOT NULL REFERENCES dragon_individuals(id) ON DELETE CASCADE,
  dragon2_id UUID NOT NULL REFERENCES dragon_individuals(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('mate', 'offspring', 'sibling', 'rival', 'ally', 'pack_member')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (dragon1_id != dragon2_id),
  UNIQUE(dragon1_id, dragon2_id, relationship_type)
);

-- Create dragon locations table
CREATE TABLE IF NOT EXISTS dragon_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('island', 'cave', 'mountain', 'forest', 'ocean', 'sky', 'underground', 'mystical')),
  climate TEXT,
  dangers TEXT[],
  notable_species UUID[] DEFAULT '{}',
  coordinates TEXT,
  image_url TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user dragon favorites table
CREATE TABLE IF NOT EXISTS user_dragon_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  species_id UUID REFERENCES dragon_species(id) ON DELETE CASCADE,
  individual_id UUID REFERENCES dragon_individuals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((species_id IS NOT NULL AND individual_id IS NULL) OR (species_id IS NULL AND individual_id IS NOT NULL)),
  UNIQUE(user_id, species_id),
  UNIQUE(user_id, individual_id)
);

-- Enable Row Level Security
ALTER TABLE dragon_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_individuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE dragon_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dragon_favorites ENABLE ROW LEVEL SECURITY;

-- Public read policies for dragon data
CREATE POLICY "Dragon classes are viewable by everyone"
  ON dragon_classes FOR SELECT
  USING (true);

CREATE POLICY "Dragon species are viewable by everyone"
  ON dragon_species FOR SELECT
  USING (true);

CREATE POLICY "Dragon abilities are viewable by everyone"
  ON dragon_abilities FOR SELECT
  USING (true);

CREATE POLICY "Dragon stats are viewable by everyone"
  ON dragon_stats FOR SELECT
  USING (true);

CREATE POLICY "Dragon individuals are viewable by everyone"
  ON dragon_individuals FOR SELECT
  USING (true);

CREATE POLICY "Dragon relationships are viewable by everyone"
  ON dragon_relationships FOR SELECT
  USING (true);

CREATE POLICY "Dragon locations are viewable by everyone"
  ON dragon_locations FOR SELECT
  USING (true);

-- User favorites policies
CREATE POLICY "Users can view all favorites"
  ON user_dragon_favorites FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own favorites"
  ON user_dragon_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_dragon_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dragon_species_class_id ON dragon_species(class_id);
CREATE INDEX IF NOT EXISTS idx_dragon_species_rarity ON dragon_species(rarity);
CREATE INDEX IF NOT EXISTS idx_dragon_abilities_species_id ON dragon_abilities(species_id);
CREATE INDEX IF NOT EXISTS idx_dragon_stats_species_id ON dragon_stats(species_id);
CREATE INDEX IF NOT EXISTS idx_dragon_individuals_species_id ON dragon_individuals(species_id);
CREATE INDEX IF NOT EXISTS idx_dragon_individuals_featured ON dragon_individuals(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_dragon_favorites_user_id ON user_dragon_favorites(user_id);

-- Add updated_at triggers
CREATE TRIGGER update_dragon_classes_updated_at
  BEFORE UPDATE ON dragon_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dragon_species_updated_at
  BEFORE UPDATE ON dragon_species
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dragon_stats_updated_at
  BEFORE UPDATE ON dragon_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dragon_individuals_updated_at
  BEFORE UPDATE ON dragon_individuals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dragon_locations_updated_at
  BEFORE UPDATE ON dragon_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial dragon classes
INSERT INTO dragon_classes (name, description, characteristics, color_code) VALUES
('Strike Class', 'Fast and agile dragons with powerful attacks', ARRAY['High speed', 'Stealth capabilities', 'Precise strikes'], '#8B5CF6'),
('Stoker Class', 'Fire-breathing dragons with high firepower', ARRAY['Intense flames', 'Heat resistance', 'Aggressive nature'], '#EF4444'),
('Boulder Class', 'Large, heavily armored defensive dragons', ARRAY['Heavy armor', 'Ground-based', 'Defensive tactics'], '#78716C'),
('Tracker Class', 'Intelligent dragons with keen senses', ARRAY['Enhanced senses', 'Tracking abilities', 'Intelligence'], '#10B981'),
('Sharp Class', 'Dragons with cutting attacks and projectiles', ARRAY['Sharp projectiles', 'Precision attacks', 'Ranged combat'], '#F59E0B'),
('Tidal Class', 'Water-dwelling dragons with aquatic abilities', ARRAY['Aquatic adaptation', 'Water attacks', 'Swimming prowess'], '#3B82F6'),
('Mystery Class', 'Rare dragons with unique or unknown abilities', ARRAY['Unique abilities', 'Mysterious nature', 'Rare encounters'], '#6366F1');

-- Insert sample dragon species
INSERT INTO dragon_species (name, class_id, description, lore, rarity, size_category, habitat, diet, temperament, intelligence_level, image_url) VALUES
('Night Fury', (SELECT id FROM dragon_classes WHERE name = 'Strike Class'), 'The unholy offspring of lightning and death itself', 'Once thought extinct, Night Furies were the most feared dragons in the archipelago. Known for their stealth, speed, and devastating plasma blasts.', 'legendary', 'medium', ARRAY['mountains', 'caves', 'forests'], 'Fish, occasionally other prey', 'Intelligent and loyal when bonded', 'exceptional', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'),
('Light Fury', (SELECT id FROM dragon_classes WHERE name = 'Strike Class'), 'A close relative of the Night Fury with unique cloaking abilities', 'Guardians of the Hidden World, Light Furies use their cloaking abilities to remain unseen by humans. They represent the wild, untamed spirit of dragonkind.', 'legendary', 'medium', ARRAY['hidden_world', 'caves'], 'Fish and sea creatures', 'Wild and independent', 'exceptional', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'),
('Deadly Nadder', (SELECT id FROM dragon_classes WHERE name = 'Tracker Class'), 'Beautiful but deadly dragons with exceptional eyesight', 'Known for their vibrant colors and deadly accuracy with tail spikes. Despite their beauty, they are formidable opponents in battle.', 'common', 'medium', ARRAY['forests', 'mountains'], 'Fish, birds, small mammals', 'Proud and territorial', 'high', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'),
('Monstrous Nightmare', (SELECT id FROM dragon_classes WHERE name = 'Stoker Class'), 'Aggressive dragons that can set themselves on fire', 'The most aggressive of dragon species, known for their ability to set themselves ablaze and their stubborn, prideful nature.', 'common', 'large', ARRAY['volcanic_areas', 'mountains'], 'Large fish, livestock', 'Aggressive and prideful', 'medium', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'),
('Gronckle', (SELECT id FROM dragon_classes WHERE name = 'Boulder Class'), 'Sturdy dragons that eat rocks and breathe lava', 'Despite their slow speed, Gronckles are incredibly durable and can digest almost any mineral, making them excellent for construction work.', 'common', 'medium', ARRAY['caves', 'rocky_areas'], 'Rocks, minerals, metals', 'Lazy but loyal', 'medium', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg');

-- Insert dragon abilities
INSERT INTO dragon_abilities (species_id, name, description, ability_type, power_level) VALUES
((SELECT id FROM dragon_species WHERE name = 'Night Fury'), 'Plasma Blast', 'Devastating purple plasma projectiles', 'breath_weapon', 10),
((SELECT id FROM dragon_species WHERE name = 'Night Fury'), 'Stealth Mode', 'Ability to fly silently and remain undetected', 'special', 9),
((SELECT id FROM dragon_species WHERE name = 'Night Fury'), 'Echolocation', 'Navigate and hunt using sound waves', 'special', 8),
((SELECT id FROM dragon_species WHERE name = 'Light Fury'), 'Plasma Blast', 'White-hot plasma projectiles', 'breath_weapon', 9),
((SELECT id FROM dragon_species WHERE name = 'Light Fury'), 'Cloaking', 'Ability to become invisible by heating scales', 'special', 10),
((SELECT id FROM dragon_species WHERE name = 'Deadly Nadder'), 'Spine Shot', 'Launch tail spikes with deadly accuracy', 'physical', 8),
((SELECT id FROM dragon_species WHERE name = 'Deadly Nadder'), 'Magnesium Fire', 'Bright, hot flames that can blind enemies', 'breath_weapon', 7),
((SELECT id FROM dragon_species WHERE name = 'Monstrous Nightmare'), 'Body Ignition', 'Set entire body on fire', 'special', 9),
((SELECT id FROM dragon_species WHERE name = 'Monstrous Nightmare'), 'Kerosene Gel Fire', 'Sticky, long-burning flames', 'breath_weapon', 8),
((SELECT id FROM dragon_species WHERE name = 'Gronckle'), 'Lava Blast', 'Molten rock projectiles', 'breath_weapon', 6),
((SELECT id FROM dragon_species WHERE name = 'Gronckle'), 'Rock Digestion', 'Ability to eat and digest any mineral', 'special', 5);

-- Insert dragon stats
INSERT INTO dragon_stats (species_id, firepower, speed, armor, stealth, venom, jaw_strength, wing_span_meters, length_meters, weight_kg) VALUES
((SELECT id FROM dragon_species WHERE name = 'Night Fury'), 10, 10, 8, 10, 0, 6, 14.0, 8.0, 450.0),
((SELECT id FROM dragon_species WHERE name = 'Light Fury'), 9, 10, 7, 10, 0, 6, 13.5, 7.5, 420.0),
((SELECT id FROM dragon_species WHERE name = 'Deadly Nadder'), 8, 8, 6, 4, 0, 5, 12.0, 9.0, 380.0),
((SELECT id FROM dragon_species WHERE name = 'Monstrous Nightmare'), 10, 6, 8, 2, 0, 8, 16.0, 11.0, 650.0),
((SELECT id FROM dragon_species WHERE name = 'Gronckle'), 6, 3, 10, 1, 0, 7, 8.0, 6.0, 800.0);

-- Insert famous dragon individuals
INSERT INTO dragon_individuals (name, species_id, description, status, gender, age_category, rider_name, location, first_appearance, special_traits, is_featured) VALUES
('Toothless', (SELECT id FROM dragon_species WHERE name = 'Night Fury'), 'The last known Night Fury and Hiccup''s best friend', 'alive', 'male', 'adult', 'Hiccup Horrendous Haddock III', 'Hidden World', 'How to Train Your Dragon (2010)', ARRAY['Alpha status', 'Retractable teeth', 'Prosthetic tail fin'], true),
('Light Fury', (SELECT id FROM dragon_species WHERE name = 'Light Fury'), 'Toothless''s mate and mother of their offspring', 'alive', 'female', 'adult', null, 'Hidden World', 'How to Train Your Dragon: The Hidden World (2019)', ARRAY['Cloaking ability', 'Wild nature', 'Maternal instincts'], true),
('Stormfly', (SELECT id FROM dragon_species WHERE name = 'Deadly Nadder'), 'Astrid''s loyal and fierce dragon companion', 'alive', 'female', 'adult', 'Astrid Hofferson', 'New Berk', 'How to Train Your Dragon (2010)', ARRAY['Exceptional accuracy', 'Competitive nature', 'Strong bond with rider'], true),
('Hookfang', (SELECT id FROM dragon_species WHERE name = 'Monstrous Nightmare'), 'Snotlout''s temperamental but loyal dragon', 'alive', 'male', 'adult', 'Snotlout Jorgenson', 'New Berk', 'How to Train Your Dragon (2010)', ARRAY['Stubborn personality', 'Protective of rider', 'Rivalry with other dragons'], true),
('Meatlug', (SELECT id FROM dragon_species WHERE name = 'Gronckle'), 'Fishlegs''s gentle and affectionate dragon', 'alive', 'female', 'adult', 'Fishlegs Ingerman', 'New Berk', 'How to Train Your Dragon (2010)', ARRAY['Gentle nature', 'Love of rocks', 'Maternal behavior'], true);

-- Insert dragon relationships
INSERT INTO dragon_relationships (dragon1_id, dragon2_id, relationship_type, description) VALUES
((SELECT id FROM dragon_individuals WHERE name = 'Toothless'), (SELECT id FROM dragon_individuals WHERE name = 'Light Fury'), 'mate', 'Bonded pair who found love and started a family together'),
((SELECT id FROM dragon_individuals WHERE name = 'Stormfly'), (SELECT id FROM dragon_individuals WHERE name = 'Hookfang'), 'rival', 'Competitive relationship, often competing for dominance'),
((SELECT id FROM dragon_individuals WHERE name = 'Meatlug'), (SELECT id FROM dragon_individuals WHERE name = 'Stormfly'), 'ally', 'Close friendship between the two female dragons');

-- Insert dragon locations
INSERT INTO dragon_locations (name, description, location_type, climate, dangers, notable_species, is_hidden) VALUES
('Hidden World', 'The secret sanctuary beneath the ocean where all dragons originated', 'underground', 'Temperate with glowing crystals', ARRAY['Bewilderbeast guardians', 'Territorial disputes'], ARRAY[], true),
('Isle of Berk', 'The Viking island home, now coexisting with dragons', 'island', 'Cold and windy', ARRAY['Dragon raids (historical)', 'Harsh weather'], ARRAY[], false),
('Dragon Island', 'Former nest of the Red Death', 'island', 'Volcanic and hot', ARRAY['Lava flows', 'Unstable terrain'], ARRAY[], false),
('Valka''s Sanctuary', 'Hidden dragon sanctuary created by Valka', 'cave', 'Temperate', ARRAY['Bewilderbeast territory', 'Ice formations'], ARRAY[], true),
('New Berk', 'The new Viking settlement after leaving old Berk', 'island', 'Temperate', ARRAY['Dragon hunters', 'Unknown territories'], ARRAY[], false);