import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const MEDIA_BUCKET = 'commune-media';

/**
 * Convert database snake_case article row to frontend camelCase object.
 */
function mapArticleFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || '',
    author: row.author || {
      name: 'Kolektif Redaksi',
      role: 'Kolektif Gerakan Mahasiswa',
      avatar: '/images/default-avatar.png',
      bio: '',
    },
    date: row.date,
    readTime: row.read_time || '5 min baca',
    thumbnail: row.thumbnail || '',
    content: row.content || '',
    fontFamily: row.font_family || 'font-anton',
    textAlign: row.text_align || 'text-justify',
    featured: Boolean(row.featured),
    likes: row.likes || 0,
    comments: Array.isArray(row.comments) ? row.comments : [],
    commentsCount: row.comments_count ?? (Array.isArray(row.comments) ? row.comments.length : 0),
    views: row.views || 0,
  };
}

/**
 * Convert frontend camelCase article object to database snake_case row.
 */
function mapArticleToDb(article) {
  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle || '',
    excerpt: article.excerpt || '',
    author: article.author,
    date: article.date,
    read_time: article.readTime || '5 min baca',
    thumbnail: article.thumbnail || '',
    content: article.content || '',
    font_family: article.fontFamily || 'font-anton',
    text_align: article.textAlign || 'text-justify',
    featured: Boolean(article.featured),
    likes: article.likes || 0,
    comments: Array.isArray(article.comments) ? article.comments : [],
    comments_count: article.commentsCount ?? (Array.isArray(article.comments) ? article.comments.length : 0),
    views: article.views || 0,
  };
}

function mapZineFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    edition: row.edition || 'EDISI #01',
    description: row.description || '',
    cover: row.cover || '',
    fileUrl: row.file_url || '',
    fileName: row.file_name || '',
    fileSize: row.file_size || '',
    date: row.date,
    downloads: row.downloads || 0,
  };
}

function mapZineToDb(zine) {
  return {
    id: zine.id,
    title: zine.title,
    edition: zine.edition || 'EDISI #01',
    description: zine.description || '',
    cover: zine.cover || '',
    file_url: zine.fileUrl || '',
    file_name: zine.fileName || '',
    file_size: zine.fileSize || '',
    date: zine.date,
    downloads: zine.downloads || 0,
  };
}

/**
 * Upload an image, video, or PDF file to Supabase Storage and return its public URL.
 */
export async function uploadMediaToSupabase(file, folder = 'uploads') {
  if (!supabase) {
    return { url: null, error: new Error('Supabase belum dikonfigurasi.') };
  }

  const cleanName = (file.name || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '_');
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath);
  return { url: data?.publicUrl || null, error: null };
}

export async function fetchAllContentFromSupabase() {
  if (!supabase) return null;

  const [configRes, articlesRes, zinesRes] = await Promise.all([
    supabase.from('site_config').select('config').eq('id', 'default').maybeSingle(),
    supabase.from('articles').select('*').order('created_at', { ascending: false }),
    supabase.from('zines').select('*').order('created_at', { ascending: false }),
  ]);

  if (configRes.error) console.error('Supabase fetch config error:', configRes.error);
  if (articlesRes.error) console.error('Supabase fetch articles error:', articlesRes.error);
  if (zinesRes.error) console.error('Supabase fetch zines error:', zinesRes.error);

  return {
    config: configRes.data?.config || null,
    articles: Array.isArray(articlesRes.data) ? articlesRes.data.map(mapArticleFromDb) : null,
    zines: Array.isArray(zinesRes.data) ? zinesRes.data.map(mapZineFromDb) : null,
  };
}

export async function saveSiteConfigRemote(config) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('site_config')
    .upsert({ id: 'default', config, updated_at: new Date().toISOString() });
  return { error };
}

export async function upsertArticleRemote(article) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('articles')
    .upsert(mapArticleToDb(article));
  return { error };
}

export async function updateArticleFieldsRemote(id, fields) {
  if (!supabase) return { error: null };
  const dbFields = {};
  if (fields.title !== undefined) dbFields.title = fields.title;
  if (fields.subtitle !== undefined) dbFields.subtitle = fields.subtitle;
  if (fields.excerpt !== undefined) dbFields.excerpt = fields.excerpt;
  if (fields.author !== undefined) dbFields.author = fields.author;
  if (fields.date !== undefined) dbFields.date = fields.date;
  if (fields.readTime !== undefined) dbFields.read_time = fields.readTime;
  if (fields.thumbnail !== undefined) dbFields.thumbnail = fields.thumbnail;
  if (fields.content !== undefined) dbFields.content = fields.content;
  if (fields.fontFamily !== undefined) dbFields.font_family = fields.fontFamily;
  if (fields.textAlign !== undefined) dbFields.text_align = fields.textAlign;
  if (fields.featured !== undefined) dbFields.featured = Boolean(fields.featured);
  if (fields.likes !== undefined) dbFields.likes = fields.likes;
  if (fields.comments !== undefined) dbFields.comments = fields.comments;
  if (fields.commentsCount !== undefined) dbFields.comments_count = fields.commentsCount;
  if (fields.views !== undefined) dbFields.views = fields.views;

  const { error } = await supabase
    .from('articles')
    .update(dbFields)
    .eq('id', id);
  return { error };
}

export async function deleteArticleRemote(id) {
  if (!supabase) return { error: null };
  const { error } = await supabase.from('articles').delete().eq('id', id);
  return { error };
}

export async function upsertZineRemote(zine) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('zines')
    .upsert(mapZineToDb(zine));
  return { error };
}

export async function updateZineFieldsRemote(id, fields) {
  if (!supabase) return { error: null };
  const dbFields = {};
  if (fields.title !== undefined) dbFields.title = fields.title;
  if (fields.edition !== undefined) dbFields.edition = fields.edition;
  if (fields.description !== undefined) dbFields.description = fields.description;
  if (fields.cover !== undefined) dbFields.cover = fields.cover;
  if (fields.fileUrl !== undefined) dbFields.file_url = fields.fileUrl;
  if (fields.fileName !== undefined) dbFields.file_name = fields.fileName;
  if (fields.fileSize !== undefined) dbFields.file_size = fields.fileSize;
  if (fields.date !== undefined) dbFields.date = fields.date;
  if (fields.downloads !== undefined) dbFields.downloads = fields.downloads;

  const { error } = await supabase
    .from('zines')
    .update(dbFields)
    .eq('id', id);
  return { error };
}

export async function deleteZineRemote(id) {
  if (!supabase) return { error: null };
  const { error } = await supabase.from('zines').delete().eq('id', id);
  return { error };
}
