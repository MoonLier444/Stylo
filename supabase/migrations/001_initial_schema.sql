-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  gender      TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not')),
  age         INT CHECK (age > 0 AND age < 120),
  country     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: own rows" ON profiles USING (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STYLE PROFILES
CREATE TABLE style_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  primary_style         TEXT,
  secondary_styles      TEXT[] DEFAULT '{}',
  favorite_colors       TEXT[] DEFAULT '{}',
  avoided_colors        TEXT[] DEFAULT '{}',
  favorite_brands       TEXT[] DEFAULT '{}',
  experimentation_level TEXT CHECK (experimentation_level IN ('conservative', 'balanced', 'bold')),
  onboarding_completed  BOOLEAN DEFAULT false NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE style_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "style_profiles: own rows" ON style_profiles USING (auth.uid() = user_id);

-- STYLE REFERENCES
CREATE TABLE style_references (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  ai_analysis  JSONB,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE style_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "style_references: own rows" ON style_references USING (auth.uid() = user_id);

-- GARMENTS
CREATE TABLE garments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url        TEXT NOT NULL,
  storage_path     TEXT NOT NULL,
  name             TEXT,
  category         TEXT,
  subcategory      TEXT,
  primary_color    TEXT,
  secondary_colors TEXT[] DEFAULT '{}',
  pattern          TEXT,
  material         TEXT,
  seasons          TEXT[] DEFAULT '{}',
  formality        INT CHECK (formality >= 0 AND formality <= 10),
  dominant_style   TEXT[] DEFAULT '{}',
  ai_tags          JSONB,
  times_worn       INT DEFAULT 0 NOT NULL,
  last_worn_at     TIMESTAMPTZ,
  is_active        BOOLEAN DEFAULT true NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "garments: own rows" ON garments USING (auth.uid() = user_id);

CREATE INDEX idx_garments_user_active ON garments (user_id, is_active);
CREATE INDEX idx_garments_category ON garments (user_id, category);

-- OUTFITS
CREATE TABLE outfits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('safe', 'recommended', 'exploration')),
  garment_ids     UUID[] DEFAULT '{}' NOT NULL,
  ai_reasoning    TEXT,
  weather_context JSONB,
  generated_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_for        DATE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outfits: own rows" ON outfits USING (auth.uid() = user_id);

CREATE INDEX idx_outfits_user_date ON outfits (user_id, date_for);

-- OUTFIT FEEDBACK
CREATE TABLE outfit_feedback (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  reaction  TEXT NOT NULL CHECK (reaction IN ('liked', 'disliked', 'saved', 'worn', 'ignored')),
  worn_at   TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, outfit_id)
);

ALTER TABLE outfit_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outfit_feedback: own rows" ON outfit_feedback USING (auth.uid() = user_id);

-- WEATHER CACHE
CREATE TABLE weather_cache (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude    DECIMAL NOT NULL,
  longitude   DECIMAL NOT NULL,
  temperature DECIMAL NOT NULL,
  feels_like  DECIMAL NOT NULL,
  humidity    INT NOT NULL,
  wind_speed  DECIMAL NOT NULL,
  condition   TEXT NOT NULL,
  fetched_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL
);

ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weather_cache: own rows" ON weather_cache USING (auth.uid() = user_id);

CREATE INDEX idx_weather_cache_user_valid ON weather_cache (user_id, valid_until);

-- STYLE LEARNING
CREATE TABLE style_learning (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  profile_vector    JSONB DEFAULT '{}' NOT NULL,
  liked_patterns    JSONB DEFAULT '{}' NOT NULL,
  disliked_patterns JSONB DEFAULT '{}' NOT NULL,
  garment_weights   JSONB DEFAULT '{}' NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE style_learning ENABLE ROW LEVEL SECURITY;
CREATE POLICY "style_learning: own rows" ON style_learning USING (auth.uid() = user_id);
