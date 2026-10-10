import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Edit2, RotateCcw, CheckCircle, FileText, LayoutDashboard, Sparkles, AlertCircle } from 'lucide-react';

export function AdminModal({ 
  isOpen, 
  onClose, 
  siteConfig, 
  onSaveSiteConfig, 
  articles, 
  onAddArticle, 
  onUpdateArticle, 
  onDeleteArticle,
  onResetDefaults,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('homepage'); // 'homepage' | 'articles' | 'new-article'
  const [configForm, setConfigForm] = useState({ ...siteConfig });
  const [savedNotice, setSavedNotice] = useState(false);

  // New Article Form state
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    authorName: 'Kader IMM FEB',
    authorRole: 'Bidang RPK IMM FEB',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    readTime: '5 min read',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
    content: '',
    featured: false
  });

  if (!isOpen) return null;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    onSaveSiteConfig(configForm);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleStartEditArticle = (art) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      subtitle: art.subtitle || '',
      excerpt: art.excerpt || '',
      category: art.category,
      authorName: art.author?.name || '',
      authorRole: art.author?.role || '',
      authorAvatar: art.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      readTime: art.readTime || '5 min read',
      thumbnail: art.thumbnail || '',
      content: art.content || '',
      featured: !!art.featured
    });
    setActiveTab('new-article');
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    const payload = {
      title: articleForm.title,
      subtitle: articleForm.subtitle,
      excerpt: articleForm.excerpt || articleForm.subtitle,
      author: {
        name: articleForm.authorName || 'Kader IMM FEB',
        role: articleForm.authorRole || 'Komisariat IMM FEB',
        avatar: articleForm.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: articleForm.readTime || '5 min read',
      thumbnail: articleForm.thumbnail || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
      content: articleForm.content,
      featured: articleForm.featured
    };

    if (editingArticleId) {
      onUpdateArticle(editingArticleId, payload);
    } else {
      onAddArticle({
        id: 'art-' + Date.now(),
        ...payload,
        likes: 0,
        commentsCount: 0,
        comments: []
      });
    }

    // Reset form
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      subtitle: '',
      excerpt: '',
      authorName: 'Kader IMM FEB',
      authorRole: 'Bidang RPK IMM FEB',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      readTime: '5 min read',
      thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
      content: '',
      featured: false
    });

    setActiveTab('articles');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#121216] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#16161c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/50">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Admin Panel</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900">
                  IMM FEB
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Kelola judul beranda, deskripsi hero, dan artikel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              title="Keluar dari sesi administrator"
            >
              Keluar (Logout)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 gap-2">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'homepage'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Pengaturan Beranda (Hero)</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4 text-zinc-400" />
            <span>Daftar Artikel ({articles.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingArticleId(null);
              setActiveTab('new-article');
            }}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'new-article'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4 text-red-400" />
            <span>{editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {savedNotice && (
          <div className="bg-red-950/50 border-b border-red-800/80 px-6 py-2.5 flex items-center justify-between text-xs text-red-200 animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-red-400" />
              Perubahan berhasil disimpan dan langsung diterapkan ke halaman utama!
            </span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: HOMEPAGE SETTINGS (HERO TITLE & DESCRIPTION) */}
          {activeTab === 'homepage' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-zinc-300">
                <p className="font-semibold text-red-400 mb-1">Panduan Kustomisasi Beranda:</p>
                Bagian ini mengatur tulisan utama yang muncul di bagian atas (seperti pada gambar referensi). Semua perubahan akan tersimpan di peramban Anda.
              </div>

              {/* Hero Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Judul Utama Beranda (Hero Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={configForm.heroTitle}
                  onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                  placeholder="Contoh: Perjuangan, Kata & Suara Marjinal."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm sm:text-base text-white font-serif focus:outline-none focus:border-red-600"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Default: <em>Perjuangan, Kata & Suara Marjinal.</em> (Sesuai gambar referensi)
                </p>
              </div>

              {/* Hero Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Deskripsi / Subjudul Beranda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={configForm.heroDescription}
                  onChange={(e) => setConfigForm({ ...configForm, heroDescription: e.target.value })}
                  placeholder="Tuliskan deskripsi misi intelektual atau pengantar buletin..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 text-sm text-zinc-200 leading-relaxed focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Subjudul di Atas Artikel (Section Title)
                </label>
                <input
                  type="text"
                  value={configForm.articlesSectionTitle || ''}
                  onChange={(e) => setConfigForm({ ...configForm, articlesSectionTitle: e.target.value })}
                  placeholder="Contoh: Artikel Perjuangan"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Default: <em>Artikel Perjuangan</em> (Menjadi tajuk di atas daftar 2 kotak artikel)
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="pt-4 border-t border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 block">
                  Pratinjau Langsung (Live Preview)
                </span>
                <div className="p-6 rounded-xl bg-black border border-zinc-800 text-center">
                  <div className="flex justify-center mb-3">
                    <img 
                      src="/images/cat-head.png" 
                      alt="" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-2">
                    {configForm.heroTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mb-6">
                    {configForm.heroDescription}
                  </p>
                  <div className="pt-4 border-t border-zinc-800 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block mb-0.5">
                      • KOLEKSI TULISAN & ARSIP PEMIKIRAN
                    </span>
                    <h4 className="font-editorial text-lg font-bold text-white">
                      {configForm.articlesSectionTitle || "Artikel Perjuangan"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Teks Asli</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Beranda</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: ARTICLES LIST */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-400">
                  Daftar tulisan yang sedang tampil di halaman beranda (format 2 kolom).
                </p>
                <button
                  onClick={() => {
                    setEditingArticleId(null);
                    setActiveTab('new-article');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Artikel Baru</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
                {articles.map((art) => (
                  <div key={art.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {art.thumbnail && (
                        <img 
                          src={art.thumbnail} 
                          alt="" 
                          className="w-16 h-12 object-cover rounded-md border border-zinc-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] text-zinc-500">{art.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">
                          {art.title}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate">
                          Penulis: {art.author?.name} • {art.likes} suka • {art.comments?.length || 0} komentar
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleStartEditArticle(art)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit tulisan ini"
                      >
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => onDeleteArticle(art.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Hapus tulisan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE / EDIT ARTICLE FORM */}
          {activeTab === 'new-article' && (
            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
                <h3 className="text-sm font-bold text-white">
                  {editingArticleId ? 'Sunting Artikel' : 'Tulis Artikel / Esai Perjuangan Baru'}
                </h3>
                <span className="text-xs text-zinc-500">Format Substack-ready</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Contoh: Menggugat Kebijakan Anggaran Pendidikan Tinggi"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Subjudul / Ringkasan Singkat
                </label>
                <input
                  type="text"
                  value={articleForm.subtitle}
                  onChange={(e) => setArticleForm({ ...articleForm, subtitle: e.target.value })}
                  placeholder="Catatan kritis atas disparitas ekonomi dan gerakan kader."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={articleForm.authorName}
                    onChange={(e) => setArticleForm({ ...articleForm, authorName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Waktu Baca (Estimasi)
                  </label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="Contoh: 5 min read"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  URL Thumbnail Gambar
                </label>
                <input
                  type="url"
                  value={articleForm.thumbnail}
                  onChange={(e) => setArticleForm({ ...articleForm, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Isi Lengkap Artikel (Mendukung Markdown ##, ###, &gt; Kutipan)
                </label>
                <textarea
                  rows={8}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Tuliskan isi artikel di sini. Gunakan ## untuk Subjudul dan > untuk kutipan khusus..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 text-sm font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={articleForm.featured}
                  onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                  className="rounded border-zinc-700 text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <label htmlFor="featuredCheck" className="text-xs text-zinc-300 cursor-pointer">
                  Tandai sebagai <strong>Pilihan Redaksi (Featured)</strong>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticleId ? 'Perbarui Artikel' : 'Publikasikan Artikel'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
