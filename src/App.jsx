import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticleDetail } from './components/ArticleDetail';
import { AdminPage } from './components/AdminPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ZineSection } from './components/ZineSection';
import { Footer } from './components/Footer';
import { defaultSiteConfig, initialArticles, initialZines } from './data/initialData';
import { recordVisit, recordArticleView, recordReadingTime, sendHeartbeat } from './utils/analytics';
import {
  isSupabaseConfigured,
  fetchAllContentFromSupabase,
  saveSiteConfigRemote,
  upsertArticleRemote,
  updateArticleFieldsRemote,
  deleteArticleRemote,
  upsertZineRemote,
  updateZineFieldsRemote,
  deleteZineRemote,
} from './lib/supabase';

export function App() {
  // 1. Site Configuration State (Loaded from localStorage or initial defaults)
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('commune_config_v2') || localStorage.getItem('imm_commune_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        let updated = false;
        if (parsed.heroDescription && (parsed.heroDescription.includes('IMM') || parsed.heroDescription.includes('FEB') || parsed.heroDescription.includes('Muhammadiyah'))) {
          parsed.heroDescription = defaultSiteConfig.heroDescription;
          updated = true;
        }
        if (parsed.tagline && (parsed.tagline.includes('IMM') || parsed.tagline.includes('FEB') || parsed.tagline.includes('Muhammadiyah'))) {
          parsed.tagline = defaultSiteConfig.tagline;
          updated = true;
        }
        if (parsed.footerDescription && (parsed.footerDescription.includes('IMM') || parsed.footerDescription.includes('FEB') || parsed.footerDescription.includes('profetik') || parsed.footerDescription.includes('Tri Kompetensi'))) {
          parsed.footerDescription = defaultSiteConfig.footerDescription;
          updated = true;
        }
        if (updated) {
          localStorage.setItem('commune_config_v2', JSON.stringify(parsed));
          localStorage.setItem('imm_commune_config', JSON.stringify(parsed));
        }
        return parsed;
      }
      return defaultSiteConfig;
    } catch {
      return defaultSiteConfig;
    }
  });

  // 2. Articles State (Clean slate for collective redaksi team to populate)
  const [articles, setArticles] = useState(() => {
    try {
      const isCleaned = localStorage.getItem('imm_commune_empty_slate_v1');
      if (!isCleaned) {
        localStorage.setItem('imm_commune_empty_slate_v1', 'true');
        localStorage.removeItem('imm_commune_articles');
        localStorage.removeItem('imm_commune_zines');
        localStorage.removeItem('imm_commune_likes');
        localStorage.removeItem('imm_commune_bookmarks');
        return [];
      }
      const saved = localStorage.getItem('imm_commune_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Zines & E-Books State (Clean slate for collective redaksi team to upload)
  const [zines, setZines] = useState(() => {
    try {
      const isCleaned = localStorage.getItem('imm_commune_empty_slate_v1');
      if (!isCleaned) {
        return [];
      }
      const saved = localStorage.getItem('imm_commune_zines');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. User interaction states (Likes & Bookmarks saved to localStorage)
  const [likedArticles, setLikedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('imm_commune_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('imm_commune_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Navigation & View states
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('imm_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [syncError, setSyncError] = useState('');

  // Fetch global content from Supabase on initial load
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    fetchAllContentFromSupabase()
      .then((data) => {
        if (cancelled || !data) return;
        if (data.config) {
          setSiteConfig((prev) => ({ ...prev, ...data.config }));
        }
        if (Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
        if (Array.isArray(data.zines)) {
          setZines(data.zines);
        }
      })
      .catch((err) => {
        console.error('Failed to load Supabase data:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Sync siteConfig to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commune_config_v2', JSON.stringify(siteConfig));
      localStorage.setItem('imm_commune_config', JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  // Sync articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('imm_commune_articles', JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  }, [articles]);

  // Sync likes
  useEffect(() => {
    try {
      localStorage.setItem('imm_commune_likes', JSON.stringify(likedArticles));
    } catch (e) {
      console.error(e);
    }
  }, [likedArticles]);

  // Sync bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('imm_commune_bookmarks', JSON.stringify(bookmarkedArticles));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedArticles]);

  // Sync zines
  useEffect(() => {
    try {
      localStorage.setItem('imm_commune_zines', JSON.stringify(zines));
    } catch (e) {
      console.error(e);
    }
  }, [zines]);

  // Record real initial visit and track reading time
  useEffect(() => {
    recordVisit('/');

    // Accumulate real reading time and send active heartbeat
    const timer = setInterval(() => {
      sendHeartbeat();
      if (typeof document !== 'undefined' && !document.hidden) {
        recordReadingTime(4);
      }
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleSelectArticle = (art) => {
    const nextViews = (art.views || 0) + 1;
    const updatedArt = { ...art, views: nextViews };
    setSelectedArticle(updatedArt);
    setArticles(prev => prev.map(item => item.id === art.id ? updatedArt : item));
    recordArticleView(art.id);
    recordVisit(`/artikel/${art.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateArticleFieldsRemote(art.id, { views: nextViews });
  };

  // Handlers for Admin
  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('imm_admin_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAdminLoginOpen(false);
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminView(false);
    try {
      sessionStorage.removeItem('imm_admin_auth');
    } catch (e) {
      console.error(e);
    }
  };

  const reportSyncError = (context, error) => {
    if (!error) {
      setSyncError('');
      return;
    }
    console.error(`${context}:`, error);
    const msg = `Gagal sinkronisasi ke Supabase (${context}): ${error.message || 'Periksa konfigurasi & SQL Supabase.'}`;
    setSyncError(msg);
    alert(msg);
  };

  const handleSaveSiteConfig = async (newConfig) => {
    setSiteConfig(newConfig);
    const { error } = await saveSiteConfigRemote(newConfig);
    reportSyncError('Simpan Konfigurasi', error);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Kembalikan judul beranda, deskripsi, zine, dan konfigurasi ke pengaturan default awal?')) {
      setSiteConfig(defaultSiteConfig);
      setArticles(initialArticles);
      setZines(initialZines);
      localStorage.removeItem('imm_commune_config');
      localStorage.removeItem('imm_commune_articles');
      localStorage.removeItem('imm_commune_zines');
      const { error } = await saveSiteConfigRemote(defaultSiteConfig);
      reportSyncError('Reset Konfigurasi', error);
    }
  };

  const handleAddArticle = async (newArticle) => {
    setArticles(prev => [newArticle, ...prev]);
    const { error } = await upsertArticleRemote(newArticle);
    reportSyncError('Terbitkan Artikel', error);
  };

  const handleUpdateArticle = async (id, updatedFields) => {
    setArticles(prev => prev.map(art => art.id === id ? { ...art, ...updatedFields } : art));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({ ...prev, ...updatedFields }));
    }
    const { error } = await updateArticleFieldsRemote(id, updatedFields);
    reportSyncError('Perbarui Artikel', error);
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      setArticles(prev => prev.filter(art => art.id !== id));
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(null);
      }
      const { error } = await deleteArticleRemote(id);
      reportSyncError('Hapus Artikel', error);
    }
  };

  // Handlers for Zine Management
  const handleAddZine = async (newZine) => {
    setZines(prev => [newZine, ...prev]);
    const { error } = await upsertZineRemote(newZine);
    reportSyncError('Simpan Zine', error);
  };

  const handleUpdateZine = async (id, updatedFields) => {
    setZines(prev => prev.map(z => z.id === id ? { ...z, ...updatedFields } : z));
    const { error } = await updateZineFieldsRemote(id, updatedFields);
    reportSyncError('Perbarui Zine', error);
  };

  const handleDeleteZine = async (id) => {
    if (window.confirm('Yakin ingin menghapus berkas zine ini dari arsip?')) {
      setZines(prev => prev.filter(z => z.id !== id));
      const { error } = await deleteZineRemote(id);
      reportSyncError('Hapus Zine', error);
    }
  };

  const handleDownloadZine = (id) => {
    const target = zines.find(z => z.id === id);
    const nextDownloads = (target?.downloads || 0) + 1;
    setZines(prev => prev.map(z => z.id === id ? { ...z, downloads: nextDownloads } : z));
    updateZineFieldsRemote(id, { downloads: nextDownloads });
  };

  // Handlers for Reader Interactions
  const handleLikeArticle = (id) => {
    const target = articles.find(art => art.id === id);
    const alreadyLiked = likedArticles.includes(id);
    const nextLikes = alreadyLiked
      ? Math.max(0, (target?.likes || 1) - 1)
      : (target?.likes || 0) + 1;

    setLikedArticles(prev =>
      alreadyLiked ? prev.filter(item => item !== id) : [...prev, id]
    );
    setArticles(prev => prev.map(art => art.id === id ? { ...art, likes: nextLikes } : art));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({ ...prev, likes: nextLikes }));
    }
    updateArticleFieldsRemote(id, { likes: nextLikes });
  };

  const handleToggleBookmark = (id) => {
    if (bookmarkedArticles.includes(id)) {
      setBookmarkedArticles(prev => prev.filter(item => item !== id));
    } else {
      setBookmarkedArticles(prev => [...prev, id]);
    }
  };

  const handleAddComment = (articleId, newComment) => {
    const target = articles.find(art => art.id === articleId);
    const nextComments = target?.comments ? [newComment, ...target.comments] : [newComment];

    setArticles(prev => prev.map(art =>
      art.id === articleId ? { ...art, comments: nextComments, commentsCount: nextComments.length } : art
    ));

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => {
        const comments = prev.comments ? [newComment, ...prev.comments] : [newComment];
        return { ...prev, comments, commentsCount: comments.length };
      });
    }

    updateArticleFieldsRemote(articleId, {
      comments: nextComments,
      commentsCount: nextComments.length,
    });
  };

  // ==========================================
  // VIEW 1: FULL-PAGE ADMIN DASHBOARD
  // ==========================================
  if (isAdminView) {
    return (
      <AdminPage
        siteConfig={siteConfig}
        onSaveSiteConfig={handleSaveSiteConfig}
        articles={articles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
        zines={zines}
        onAddZine={handleAddZine}
        onUpdateZine={handleUpdateZine}
        onDeleteZine={handleDeleteZine}
        onResetDefaults={handleResetDefaults}
        supabaseConfigured={isSupabaseConfigured}
        syncError={syncError}
        onBackToHome={() => {
          setIsAdminView(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // VIEW 2: PUBLIC READER PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. Header & Navigation (Image 2 Logo on left, Join Commune on right) */}
      <Navbar
        siteConfig={siteConfig}
        onViewHome={() => setSelectedArticle(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedArticle ? (
          // Immersive Substack Article View
          <ArticleDetail
            article={selectedArticle}
            onBack={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onLikeArticle={handleLikeArticle}
            isLiked={likedArticles.includes(selectedArticle.id)}
            isBookmarked={bookmarkedArticles.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onAddComment={handleAddComment}
          />
        ) : (
          // Homepage with Hero (Reference Image 1) + 2-Column Article Grid + Zine Download (Image uploaded)
          <>
            {/* Top Hero Section matching Image 1 */}
            <Hero
              siteConfig={siteConfig}
            />

            {/* 2-Column Article Grid with Pagination */}
            <ArticleGrid
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onLikeArticle={handleLikeArticle}
              onEditArticle={handleOpenAdmin}
              likedArticles={likedArticles}
              bookmarkedArticles={bookmarkedArticles}
              onToggleBookmark={handleToggleBookmark}
              siteConfig={siteConfig}
            />

            {/* Zine Download Section (matching user uploaded reference) */}
            <ZineSection
              zines={zines}
              siteConfig={siteConfig}
              onDownloadZine={handleDownloadZine}
            />
          </>
        )}
      </main>

      {/* Footer (Contains secret admin trigger on "Ditegakkan dengan cinta, akal sehat, dan bara perjuangan.") */}
      <Footer
        siteConfig={siteConfig}
        onOpenAdminLogin={handleOpenAdmin}
      />

      {/* Admin Login Modal (Requires Username and Password) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
