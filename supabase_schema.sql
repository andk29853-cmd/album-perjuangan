-- ============================================================
-- SUPABASE SCHEMA FOR ALBUM PERJUANGAN COMMUNE
-- Jalankan seluruh script ini di Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Tabel Konfigurasi Situs (1 baris global id='default')
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Artikel Perjuangan
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  author JSONB NOT NULL DEFAULT '{"name":"Kolektif Redaksi","role":"Kolektif Gerakan Mahasiswa","avatar":"/images/default-avatar.png","bio":""}'::jsonb,
  date TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min baca',
  thumbnail TEXT DEFAULT '',
  content TEXT DEFAULT '',
  font_family TEXT DEFAULT 'font-anton',
  text_align TEXT DEFAULT 'text-justify',
  featured BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  comments_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Zine & E-Book
CREATE TABLE IF NOT EXISTS public.zines (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  edition TEXT DEFAULT 'EDISI #01',
  description TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  file_size TEXT DEFAULT '',
  date TEXT NOT NULL,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zines ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses publik untuk membaca & menulis (karena autentikasi admin dikelola aplikasi kolektif)
DROP POLICY IF EXISTS "Public full access site_config" ON public.site_config;
CREATE POLICY "Public full access site_config"
  ON public.site_config FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access articles" ON public.articles;
CREATE POLICY "Public full access articles"
  ON public.articles FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access zines" ON public.zines;
CREATE POLICY "Public full access zines"
  ON public.zines FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Storage Bucket untuk Gambar, Video, dan PDF Zine
INSERT INTO storage.buckets (id, name, public)
VALUES ('commune-media', 'commune-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan akses publik untuk membaca & mengunggah file ke bucket commune-media
DROP POLICY IF EXISTS "Public read commune-media" ON storage.objects;
CREATE POLICY "Public read commune-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'commune-media');

DROP POLICY IF EXISTS "Public insert commune-media" ON storage.objects;
CREATE POLICY "Public insert commune-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'commune-media');

DROP POLICY IF EXISTS "Public update commune-media" ON storage.objects;
CREATE POLICY "Public update commune-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'commune-media');

DROP POLICY IF EXISTS "Public delete commune-media" ON storage.objects;
CREATE POLICY "Public delete commune-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'commune-media');
