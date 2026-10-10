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

export function App() {
  // 1. Site Configuration State (Loaded from localStorage or initial defaults)
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('imm_commune_config');
      return saved ? JSON.parse(saved) : defaultSiteConfig;
    } catch {
      return defaultSiteConfig;
    }
  });

  // 2. Articles State (Loaded from localStorage or initial articles)
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('imm_commune_articles');
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  // 3. Zines & E-Books State (Loaded from localStorage or initial zines)
  const [zines, setZines] = useState(() => {
    try {
      const saved = localStorage.getItem('imm_commune_zines');
      return saved ? JSON.parse(saved) : initialZines;
    } catch {
      return initialZines;
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

  // Sync siteConfig to localStorage
  useEffect(() => {
    try {
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
    setSelectedArticle(art);
    recordArticleView(art.id);
    recordVisit(`/artikel/${art.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSaveSiteConfig = (newConfig) => {
    setSiteConfig(newConfig);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Kembalikan judul beranda, deskripsi, zine, dan konfigurasi ke pengaturan default awal?')) {
      setSiteConfig(defaultSiteConfig);
      setArticles(initialArticles);
      setZines(initialZines);
      localStorage.removeItem('imm_commune_config');
      localStorage.removeItem('imm_commune_articles');
      localStorage.removeItem('imm_commune_zines');
    }
  };

  const handleAddArticle = (newArticle) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const handleUpdateArticle = (id, updatedFields) => {
    setArticles(prev => prev.map(art => art.id === id ? { ...art, ...updatedFields } : art));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      setArticles(prev => prev.filter(art => art.id !== id));
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(null);
      }
    }
  };

  // Handlers for Zine Management
  const handleAddZine = (newZine) => {
    setZines(prev => [newZine, ...prev]);
  };

  const handleUpdateZine = (id, updatedFields) => {
    setZines(prev => prev.map(z => z.id === id ? { ...z, ...updatedFields } : z));
  };

  const handleDeleteZine = (id) => {
    if (window.confirm('Yakin ingin menghapus berkas zine ini dari arsip?')) {
      setZines(prev => prev.filter(z => z.id !== id));
    }
  };

  const handleDownloadZine = (id) => {
    setZines(prev => prev.map(z => z.id === id ? { ...z, downloads: (z.downloads || 0) + 1 } : z));
  };

  // Handlers for Reader Interactions
  const handleLikeArticle = (id) => {
    if (likedArticles.includes(id)) {
      setLikedArticles(prev => prev.filter(item => item !== id));
      setArticles(prev => prev.map(art => art.id === id ? { ...art, likes: Math.max(0, (art.likes || 1) - 1) } : art));
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(prev => ({ ...prev, likes: Math.max(0, (prev.likes || 1) - 1) }));
      }
    } else {
      setLikedArticles(prev => [...prev, id]);
      setArticles(prev => prev.map(art => art.id === id ? { ...art, likes: (art.likes || 0) + 1 } : art));
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
    }
  };

  const handleToggleBookmark = (id) => {
    if (bookmarkedArticles.includes(id)) {
      setBookmarkedArticles(prev => prev.filter(item => item !== id));
    } else {
      setBookmarkedArticles(prev => [...prev, id]);
    }
  };

  const handleAddComment = (articleId, newComment) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const comments = art.comments ? [newComment, ...art.comments] : [newComment];
        return { ...art, comments, commentsCount: comments.length };
      }
      return art;
    }));

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => {
        const comments = prev.comments ? [newComment, ...prev.comments] : [newComment];
        return { ...prev, comments, commentsCount: comments.length };
      });
    }
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
