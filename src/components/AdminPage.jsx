import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, Users, Eye, TrendingUp, Sparkles, FileText, Plus, Trash2, 
  Edit2, RotateCcw, ArrowLeft, LogOut, CheckCircle, Clock, Heart, 
  MessageSquare, Globe, Smartphone, Laptop, Save, ShieldCheck, Flame, ExternalLink,
  RefreshCw, Activity, Radio,
  Upload, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Minus, Type, Check,
  ArrowDownToLine, BookOpen, FileCheck, FileDown, FolderDown, File
} from 'lucide-react';
import { 
  getAnalyticsSummary, 
  resetAnalyticsData 
} from '../utils/analytics';

export function AdminPage({ 
  siteConfig, 
  onSaveSiteConfig, 
  articles, 
  onAddArticle, 
  onUpdateArticle, 
  onDeleteArticle, 
  zines = [],
  onAddZine,
  onUpdateZine,
  onDeleteZine,
  onResetDefaults, 
  onBackToHome, 
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'homepage' | 'articles' | 'new-article' | 'zines'
  const [configForm, setConfigForm] = useState({ ...siteConfig });
  const [savedNotice, setSavedNotice] = useState(false);

  // Zine Management State
  const [editingZineId, setEditingZineId] = useState(null);
  const [showZineForm, setShowZineForm] = useState(false);
  const [zineForm, setZineForm] = useState({
    title: '',
    edition: 'EDISI #01',
    description: '',
    cover: '',
    fileUrl: '',
    fileData: '',
    fileName: '',
    fileSize: ''
  });

  // New / Edit Article Form State
  const [editingArticleId, setEditingArticleId] = useState(null);
  const contentTextareaRef = useRef(null);
  const [editorMode, setEditorMode] = useState('write'); // 'write' | 'preview'

  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    authorName: 'Kader IMM FEB',
    authorRole: 'Bidang RPK IMM FEB',
    authorAvatar: '/images/default-avatar.png',
    authorBio: 'Kader aktif Ikatan Mahasiswa Muhammadiyah Komisariat Fakultas Ekonomi dan Bisnis. Berkomitmen merawat tradisi intelektual, dialektika kritis, dan pengabdian umat.',
    readTime: '5 min read',
    thumbnail: '',
    content: '',
    fontFamily: 'font-anton', // 'font-anton' | 'font-serif' | 'font-sans' | 'font-mono'
    textAlign: 'text-justify', // 'text-justify' | 'text-left' | 'text-center' | 'text-right'
    featured: false
  });

  // Calculate live engagement metrics from articles
  const totalLikes = articles.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalComments = articles.reduce((acc, curr) => acc + (curr.comments?.length || curr.commentsCount || 0), 0);
  const totalWords = articles.reduce((acc, curr) => acc + (curr.content ? curr.content.split(/\s+/).length : 0), 0);

  // Dynamic real visitor stats from analytics engine
  const [visitorStats, setVisitorStats] = useState(() => getAnalyticsSummary(articles));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simulationNotice, setSimulationNotice] = useState('');

  // Sync visitor stats when articles change & auto-poll every 3 seconds for live heartbeat changes
  useEffect(() => {
    setVisitorStats(getAnalyticsSummary(articles));
    const interval = setInterval(() => {
      setVisitorStats(getAnalyticsSummary(articles));
    }, 3000);
    return () => clearInterval(interval);
  }, [articles]);

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setVisitorStats(getAnalyticsSummary(articles));
      setIsRefreshing(false);
    }, 400);
  };

  const handleResetAnalytics = () => {
    if (window.confirm('Reset seluruh log statistik pengunjung dan mulai pencatatan real dari sekarang?')) {
      resetAnalyticsData();
      setVisitorStats(getAnalyticsSummary(articles));
      setSimulationNotice('Log statistik telah di-reset ke kondisi awal.');
      setTimeout(() => setSimulationNotice(''), 3000);
    }
  };

  const handleHeroEmblemUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file logo maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigForm(prev => ({ ...prev, heroEmblem: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFooterLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file logo footer maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigForm(prev => ({ ...prev, footerLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Ukuran file thumbnail maksimal 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleForm(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Zine Cover & E-Book Upload Handlers
  const handleZineCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Ukuran gambar cover zine maksimal 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setZineForm(prev => ({ ...prev, cover: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZineFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const reader = new FileReader();
      reader.onloadend = () => {
        setZineForm(prev => ({
          ...prev,
          fileData: reader.result,
          fileName: file.name,
          fileSize: sizeMB
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveZine = (e) => {
    e.preventDefault();
    if (!zineForm.title.trim()) {
      alert('Judul zine wajib diisi');
      return;
    }

    const payload = {
      title: zineForm.title,
      edition: zineForm.edition || 'EDISI #01',
      description: zineForm.description || '',
      cover: zineForm.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      fileUrl: zineForm.fileUrl || '',
      fileData: zineForm.fileData || '',
      fileName: zineForm.fileName || `${zineForm.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: zineForm.fileSize || '12.0 MB',
      date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    };

    if (editingZineId) {
      onUpdateZine(editingZineId, payload);
    } else {
      onAddZine({
        id: 'zine-' + Date.now(),
        ...payload,
        downloads: 0
      });
    }

    setEditingZineId(null);
    setShowZineForm(false);
    setZineForm({
      title: '',
      edition: 'EDISI #01',
      description: '',
      cover: '',
      fileUrl: '',
      fileData: '',
      fileName: '',
      fileSize: ''
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleStartEditZine = (zine) => {
    setEditingZineId(zine.id);
    setZineForm({
      title: zine.title,
      edition: zine.edition || '',
      description: zine.description || '',
      cover: zine.cover || '',
      fileUrl: zine.fileUrl || '',
      fileData: zine.fileData || '',
      fileName: zine.fileName || '',
      fileSize: zine.fileSize || ''
    });
    setShowZineForm(true);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCancelEditZine = () => {
    setEditingZineId(null);
    setShowZineForm(false);
    setZineForm({
      title: '',
      edition: 'EDISI #01',
      description: '',
      cover: '',
      fileUrl: '',
      fileData: '',
      fileName: '',
      fileSize: ''
    });
  };

  const insertFormatting = (prefix, suffix = '', defaultText = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const newContent = `${before}${prefix}${selectedText}${suffix}${after}`;
    setArticleForm(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

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
      authorName: art.author?.name || '',
      authorRole: art.author?.role || '',
      authorAvatar: (art.author?.avatar && !art.author.avatar.includes('unsplash')) ? art.author.avatar : '/images/default-avatar.png',
      authorBio: art.author?.bio || art.authorBio || 'Kader aktif Ikatan Mahasiswa Muhammadiyah Komisariat Fakultas Ekonomi dan Bisnis. Berkomitmen merawat tradisi intelektual, dialektika kritis, dan pengabdian umat.',
      readTime: art.readTime || '5 min read',
      thumbnail: art.thumbnail || '',
      content: art.content || '',
      fontFamily: art.fontFamily || 'font-anton',
      textAlign: art.textAlign || 'text-justify',
      featured: !!art.featured
    });
    setActiveTab('new-article');
    setEditorMode('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        avatar: (articleForm.authorAvatar && !articleForm.authorAvatar.includes('unsplash')) ? articleForm.authorAvatar : '/images/default-avatar.png',
        bio: articleForm.authorBio || 'Kader aktif Ikatan Mahasiswa Muhammadiyah Komisariat Fakultas Ekonomi dan Bisnis. Berkomitmen merawat tradisi intelektual, dialektika kritis, dan pengabdian umat.'
      },
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: articleForm.readTime || `${Math.max(1, Math.ceil((articleForm.content ? articleForm.content.split(/\s+/).length : 200) / 200))} min baca`,
      thumbnail: articleForm.thumbnail || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
      content: articleForm.content,
      fontFamily: articleForm.fontFamily || 'font-anton',
      textAlign: articleForm.textAlign || 'text-justify',
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

    setEditingArticleId(null);
    setArticleForm({
      title: '',
      subtitle: '',
      excerpt: '',
      authorName: 'Kader IMM FEB',
      authorRole: 'Bidang RPK IMM FEB',
      authorAvatar: '/images/default-avatar.png',
      authorBio: 'Kader aktif Ikatan Mahasiswa Muhammadiyah Komisariat Fakultas Ekonomi dan Bisnis. Berkomitmen merawat tradisi intelektual, dialektika kritis, dan pengabdian umat.',
      readTime: '5 min read',
      thumbnail: '',
      content: '',
      fontFamily: 'font-anton',
      textAlign: 'text-justify',
      featured: false
    });

    setActiveTab('articles');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#0d0d11]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-commune.png" 
              alt="Commune Logo" 
              className="h-9 w-auto object-contain cursor-pointer"
              onClick={onBackToHome}
            />
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Panel Administrator
                </span>
                <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-900 px-1.5 py-0.2 rounded font-mono">
                  IMM FEB
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pusat Kendali Redaksi & Statistik Pembaca
              </p>
            </div>
          </div>

          {/* Action buttons (Back to website & Logout) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-all shadow-sm"
              title="Kembali ke halaman utama pembaca"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
              <span>Lihat Website</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/50 transition-all shadow-sm"
              title="Keluar dari sesi administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-zinc-800/60 no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-red-500" />
            <span>Statistik Pengunjung</span>
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'homepage'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span>Pengaturan Beranda (Hero)</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'articles'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4 text-zinc-400" />
            <span>Kelola Artikel ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zines')}
            className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'zines'
                ? 'border-[#eb3d4d] text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4 text-[#eb3d4d]" />
            <span>Kelola Zine & E-Book ({zines.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingArticleId(null);
              setActiveTab('new-article');
            }}
            className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'new-article'
                ? 'border-red-600 text-white bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4 text-red-400" />
            <span>{editingArticleId ? 'Sunting Artikel' : 'Tulis Artikel Baru'}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        
        {/* Success Alert Banner */}
        {savedNotice && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-xs sm:text-sm text-red-200 flex items-center justify-between shadow-lg animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-red-400 shrink-0" />
              Perubahan berhasil disimpan dan langsung diterapkan ke halaman utama!
            </span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: STATISTIK & ANALISIS PENGUNJUNG                    */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* TAB 1: STATISTIK & ANALISIS PENGUNJUNG (DATA REAL)        */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header info bar with live status & controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Statistik & Performa Pembaca
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-800">
                    <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                    DATA REAL-TIME
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Data riil kunjungan browser, deteksi perangkat, sumber lalu lintas, dan interaksi pembaca.
                </p>
              </div>

              {/* Action buttons (Live indicator, Refresh, Test Visit, Reset) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{visitorStats.activeNow} Aktif Sekarang {visitorStats.activeNow === 1 ? '(1 Tab Anda)' : '(Tab Terbuka)'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshStats}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all disabled:opacity-50"
                  title="Perbarui angka analitik langsung dari penyimpanan riil"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
                  <span>Perbarui</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAnalytics}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 text-xs font-semibold border border-zinc-800 transition-all"
                  title="Reset seluruh riwayat log pengunjung dan mulai dari nol"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Log</span>
                </button>
              </div>
            </div>

            {/* Notification if simulation visit added or reset */}
            {simulationNotice && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-center justify-between animate-fade-in">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400" />
                  {simulationNotice}
                </span>
              </div>
            )}

            {/* 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: Total Real Visitors */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Pengunjung Unik Riil
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {visitorStats.totalVisitors}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Tidak duplikat saat refresh ({visitorStats.pageviews || visitorStats.totalVisitors} tayangan)</span>
                </div>
              </div>

              {/* Card 2: Today Visitors */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Pengunjung Hari Ini
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {visitorStats.todayVisitors}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Rata-rata baca: {visitorStats.avgReadingTime}</span>
                </div>
              </div>

              {/* Card 3: Total Likes & Engagement */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Apresiasi & Suka
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                    <Heart className="w-4 h-4 fill-red-500" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {totalLikes}
                </div>
                <div className="text-xs text-zinc-400 font-medium">
                  Dari {articles.length} esai perjuangan
                </div>
              </div>

              {/* Card 4: Discussion & Comments */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-zinc-800/80 shadow-md hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Tanggapan Dialektika
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {totalComments}
                </div>
                <div className="text-xs text-zinc-400 font-medium">
                  Komentar dan kritik pembaca
                </div>
              </div>

            </div>

            {/* Charts & Breakdown Section (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Traffic Weekly Bar Chart (2 cols wide) */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121216] border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-white">
                      Grafik Kunjungan 7 Hari Terakhir
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Lonjakan aktivitas pembaca dalam sepekan (berdasarkan kalender nyata)
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                    Minggu Ini
                  </span>
                </div>

                {/* Bar Graph */}
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                  {visitorStats.weeklyData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[11px] font-mono text-zinc-400 opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.visits}
                      </span>
                      <div 
                        className="w-full max-w-[44px] bg-zinc-800 group-hover:bg-red-600 rounded-t-lg transition-all duration-300 relative overflow-hidden"
                        style={{ height: item.height }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-red-600/50 to-transparent group-hover:opacity-100 opacity-40 transition-opacity" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-zinc-400 group-hover:text-white block">
                          {item.day}
                        </span>
                        <span className="text-[10px] text-zinc-600 block">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources & Device Breakdown (1 col wide) */}
              <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800 shadow-md space-y-6">
                
                {/* Traffic sources */}
                <div>
                  <h3 className="font-editorial text-lg font-bold text-white mb-1">
                    Sumber Kunjungan
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    Kanal riil pembaca mengakses esai
                  </p>

                  <div className="space-y-3">
                    {visitorStats.trafficSources.map((source, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-300 font-medium">{source.name}</span>
                          <span className="font-mono text-zinc-400">{source.count} ({source.percent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${source.color}`} 
                            style={{ width: `${source.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device distribution */}
                <div className="pt-4 border-t border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 block">
                    Perangkat Pembaca
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <Smartphone className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <div className="text-base font-bold text-white">{visitorStats.devices.mobilePercent}%</div>
                      <div className="text-[11px] text-zinc-400">Smartphone ({visitorStats.devices.mobileCount})</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <Laptop className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
                      <div className="text-base font-bold text-white">{visitorStats.devices.desktopPercent}%</div>
                      <div className="text-[11px] text-zinc-400">Desktop ({visitorStats.devices.desktopCount})</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Live Visitor Feed (Real-Time Transparency) */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800 shadow-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg font-bold text-white">
                      Log Aktivitas Kunjungan Terbaru
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-zinc-400">
                    Aktivitas pembaca yang tercatat langsung oleh sistem browser
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  {visitorStats.recentVisits?.length || 0} Aktivitas Terbaru
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {visitorStats.recentVisits && visitorStats.recentVisits.length > 0 ? (
                  visitorStats.recentVisits.map((item, idx) => (
                    <div key={item.id || idx} className="py-3 flex items-center justify-between text-xs hover:bg-zinc-900/40 px-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          {item.device?.includes('Mobile') ? (
                            <Smartphone className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-zinc-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{item.device}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">({item.browser || 'Browser'})</span>
                          </div>
                          <div className="text-zinc-400 text-[11px]">
                            Sumber: <span className="text-zinc-300 font-medium">{item.referrer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                          {item.timeAgo}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Terverifikasi
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-zinc-500 text-xs">
                    Belum ada riwayat aktivitas kunjungan.
                  </div>
                )}
              </div>
            </div>

            {/* Most Read Articles Table */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800 shadow-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-white">
                    Peringkat Esai Paling Banyak Dibaca (Data Riil)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Berdasarkan jumlah kunjungan riil per artikel dan apresiasi pembaca
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('articles')}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                  Kelola Semua Tulisan →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800/80 font-bold uppercase text-[11px]">
                      <th className="pb-3 pl-2">Judul Esai</th>
                      <th className="pb-3">Penulis</th>
                      <th className="pb-3 text-center">Tayangan Riil</th>
                      <th className="pb-3 text-center">Apresiasi Suka</th>
                      <th className="pb-3 text-center">Komentar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {(visitorStats.rankedArticles || articles).slice(0, 6).map((art, idx) => (
                      <tr key={art.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3.5 pl-2 font-medium text-white max-w-xs sm:max-w-md truncate">
                          <span className="text-red-500 font-bold mr-2">#{idx + 1}</span>
                          {art.title}
                        </td>
                        <td className="py-3.5 text-zinc-400">{art.author?.name}</td>
                        <td className="py-3.5 text-center font-mono text-blue-400 font-bold">
                          {art.realViews || 0} tayangan
                        </td>
                        <td className="py-3.5 text-center font-mono text-red-400 font-semibold">{art.likes || 0}</td>
                        <td className="py-3.5 text-center font-mono text-zinc-400">{art.comments?.length || art.commentsCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PENGATURAN BERANDA (HERO & TEKS)                   */}
        {/* ========================================================= */}
        {activeTab === 'homepage' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="pb-4 border-b border-zinc-800">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Kustomisasi Halaman Beranda
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Atur judul editorial, deskripsi misi pergerakan, dan tajuk daftar artikel
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-zinc-800 space-y-6">
              
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
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-serif focus:outline-none focus:border-red-600 shadow-inner"
                />
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Default: <em>Perjuangan, Kata & Suara Marjinal.</em> (Sesuai gambar referensi)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Deskripsi / Subjudul Beranda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={configForm.heroDescription}
                  onChange={(e) => setConfigForm({ ...configForm, heroDescription: e.target.value })}
                  placeholder="Tuliskan visi intelektual IMM FEB..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 text-sm text-zinc-200 leading-relaxed focus:outline-none focus:border-red-600 shadow-inner"
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
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 shadow-inner"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Default: <em>Artikel Perjuangan</em> (Menjadi tajuk di atas daftar 2 kotak artikel)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Tautan Tombol "Join Commune" (Instagram / Komunitas)
                </label>
                <input
                  type="url"
                  value={configForm.joinCommuneUrl || ''}
                  onChange={(e) => setConfigForm({ ...configForm, joinCommuneUrl: e.target.value })}
                  placeholder="https://www.instagram.com/album.perjuangan?..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 shadow-inner"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Mengarahkan pengunjung ke akun Instagram resmi Album Perjuangan saat tombol diklik.
                </p>
              </div>

              {/* Logo / Lambang Tengah Banner (Hero Emblem) Upload */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Logo / Lambang Tengah Banner (Hero Emblem)
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Ganti gambar logo tengah yang muncul di atas judul beranda (bisa diubah kapan saja)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfigForm({ ...configForm, heroEmblem: '/images/cat-head.png' })}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium self-start sm:self-auto transition-colors"
                  >
                    Kembalikan ke Logo Awal
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {/* Preview box */}
                  <div className="w-24 h-24 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center p-2.5 shrink-0 shadow-inner group relative">
                    <img 
                      src={configForm.heroEmblem || '/images/cat-head.png'} 
                      alt="Logo Banner" 
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                    />
                  </div>

                  {/* Upload controls */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <label className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-dashed border-zinc-600 text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer transition-all shadow-sm">
                      <Upload className="w-4 h-4 text-red-400" />
                      <span>Unggah Logo Baru dari Media Komputer / HP</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleHeroEmblemUpload}
                      />
                    </label>
                    <p className="text-[11px] text-zinc-500 text-center sm:text-left">
                      Disarankan file PNG transparan (tanpa background) untuk tampilan terbaik di atas gradien hitam.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pengaturan Footer: Logo Kiri & Deskripsi Kanan */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Pengaturan Footer (Logo Kiri & Deskripsi Kanan)
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Ubah logo dan naskah visi/deskripsi yang muncul di bagian paling bawah web (footer)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfigForm({ 
                      ...configForm, 
                      footerLogo: '/images/logo-commune.png',
                      footerDescription: 'Sebuah ikhtiar literasi dan advokasi profetik dalam mengartikulasikan keresahan sosial, ketimpangan ekonomi, serta meneguhkan kembali Tri Kompetensi Dasar: Religiusitas, Intelektualitas, dan Humanitas.'
                    })}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium self-start sm:self-auto transition-colors"
                  >
                    Kembalikan ke Teks & Logo Awal
                  </button>
                </div>

                {/* Footer Logo Upload & Preview */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Gambar Logo Footer (Sisi Kiri)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="h-20 w-52 rounded-xl bg-black border border-zinc-800 flex items-center justify-center p-2.5 shrink-0">
                      <img 
                        src={configForm.footerLogo || '/images/logo-commune.png'} 
                        alt="Logo Footer Preview" 
                        className="h-14 sm:h-16 w-auto object-contain"
                      />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-dashed border-zinc-600 text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-red-400" />
                        <span>Unggah Logo Footer Baru dari Komputer / HP</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFooterLogoUpload}
                        />
                      </label>
                      <input 
                        type="url"
                        value={configForm.footerLogo || ''}
                        onChange={(e) => setConfigForm({ ...configForm, footerLogo: e.target.value })}
                        placeholder="Atau tautan URL gambar (https://...)"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Description Input */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Naskah Deskripsi Footer (Sisi Kanan)
                  </label>
                  <textarea
                    rows={3}
                    value={configForm.footerDescription || ''}
                    onChange={(e) => setConfigForm({ ...configForm, footerDescription: e.target.value })}
                    placeholder="Tuliskan deskripsi visi yang tampil di sebelah kanan logo footer..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 leading-relaxed focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-6 border-t border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 block">
                  Pratinjau Langsung (Live Preview di Beranda)
                </span>
                <div className="p-8 rounded-2xl bg-black border border-zinc-800 text-center">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={configForm.heroEmblem || "/images/cat-head.png"} 
                      alt="Logo Preview" 
                      className="w-16 h-16 object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                    />
                  </div>
                  <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white mb-3">
                    {configForm.heroTitle}
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
                    {configForm.heroDescription}
                  </p>
                  <div className="pt-5 border-t border-zinc-800 text-left mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1 mb-1">
                      <Flame className="w-3 h-3 text-red-500" />
                      <span>KOLEKSI TULISAN & ARSIP PEMIKIRAN</span>
                    </span>
                    <h4 className="font-editorial text-xl font-bold text-white">
                      {configForm.articlesSectionTitle || "Artikel Perjuangan"}
                    </h4>
                  </div>

                  {/* Footer Live Preview */}
                  <div className="pt-6 border-t border-zinc-800 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                      PRATINJAU FOOTER BARU
                    </span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
                      <img 
                        src={configForm.footerLogo || '/images/logo-commune.png'} 
                        alt="Logo Footer" 
                        className="h-12 sm:h-14 w-auto object-contain shrink-0"
                      />
                      <p className="text-xs text-zinc-400 max-w-md sm:text-right">
                        {configForm.footerDescription || "Sebuah ikhtiar literasi dan advokasi profetik..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Teks Asli</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Beranda</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KELOLA ARTIKEL                                     */}
        {/* ========================================================= */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Manajemen Artikel & Tulisan
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Daftar seluruh naskah yang terbit dalam format 2 kotak di halaman depan
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingArticleId(null);
                  setActiveTab('new-article');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-950/40 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Artikel Baru</span>
              </button>
            </div>

            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-[#121216]">
              {articles.map((art) => (
                <div key={art.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-900/50 transition-colors">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {art.thumbnail && (
                      <img 
                        src={art.thumbnail} 
                        alt="" 
                        className="w-20 h-16 sm:w-24 sm:h-18 object-cover rounded-xl border border-zinc-800 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 text-xs text-zinc-500">
                        <span>{art.date}</span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                        {art.featured && (
                          <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.2 rounded font-bold uppercase">
                            Pilihan Redaksi
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white truncate mb-1">
                        {art.title}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate max-w-xl">
                        Penulis: {art.author?.name} • {art.likes || 0} apresiasi suka • {art.comments?.length || 0} komentar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleStartEditArticle(art)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                      title="Sunting tulisan ini"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteArticle(art.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/40 transition-colors"
                      title="Hapus tulisan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TULIS / EDIT ARTIKEL BARU                          */}
        {/* ========================================================= */}
        {activeTab === 'new-article' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {editingArticleId ? 'Sunting Artikel' : 'Tulis Artikel & Risalah Perjuangan'}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Mendukung pemformatan Markdown (## Subjudul, &gt; Kutipan)
                </p>
              </div>

              <button
                onClick={() => setActiveTab('articles')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Batal & Kembali ke Daftar
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-zinc-800 space-y-5">
              
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
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-red-600"
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
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Deskripsi / Bio Penulis
                  </label>
                  <input
                    type="text"
                    value={articleForm.authorBio}
                    onChange={(e) => setArticleForm({ ...articleForm, authorBio: e.target.value })}
                    placeholder="Contoh: Kader aktif Ikatan Mahasiswa Muhammadiyah..."
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Thumbnail Upload dari Media Komputer / HP */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Thumbnail Artikel (Media Upload) <span className="text-red-500">*</span>
                </label>
                
                {articleForm.thumbnail ? (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 group">
                    <img 
                      src={articleForm.thumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer border border-zinc-600 transition-all flex items-center gap-1.5 shadow-lg">
                        <Upload className="w-3.5 h-3.5 text-red-400" />
                        <span>Ganti Gambar Media</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleThumbnailUpload}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setArticleForm({ ...articleForm, thumbnail: '' })}
                        className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold border border-red-800 transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                    <div className="p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Gambar Media Terpasang
                      </span>
                      <button
                        type="button"
                        onClick={() => setArticleForm({ ...articleForm, thumbnail: '' })}
                        className="text-red-400 hover:underline"
                      >
                        Hapus Thumbnail
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-red-950/60 border border-zinc-700 group-hover:border-red-800 flex items-center justify-center mb-3 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-red-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white">
                        Klik untuk Unggah Gambar Thumbnail dari Komputer / HP
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1">
                        Format yang didukung: JPG, PNG, WEBP, GIF (Maksimal 8MB)
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleThumbnailUpload}
                      />
                    </label>

                    {/* Optional URL input fallback */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-zinc-500 font-mono">Atau Tautan URL:</span>
                      <input
                        type="url"
                        value={articleForm.thumbnail}
                        onChange={(e) => setArticleForm({ ...articleForm, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Word-Style Rich Text Editor Canvas */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Isi Naskah Artikel (Editor Bergaya Microsoft Word) <span className="text-red-500">*</span>
                  </label>

                  {/* Mode Toggle: Tulis Word vs Pratinjau Hasil */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${editorMode === 'write' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-red-500" />
                      <span>Lembar Kerja Word</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${editorMode === 'preview' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Pratinjau Cetak</span>
                    </button>
                  </div>
                </div>

                {/* Microsoft Word Style Ribbon / Toolbar */}
                <div className="border border-zinc-700 bg-[#17171c] rounded-t-2xl p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                  
                  {/* Font Family Selector */}
                  <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-700/80">
                    <Type className="w-3.5 h-3.5 text-red-400" />
                    <select
                      value={articleForm.fontFamily || 'font-anton'}
                      onChange={(e) => setArticleForm({ ...articleForm, fontFamily: e.target.value })}
                      className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
                      title="Pilih Jenis Huruf (Font Family)"
                    >
                      <option value="font-anton" className="bg-zinc-900 text-white font-anton">Anton (Gagah & Tegas)</option>
                      <option value="font-serif" className="bg-zinc-900 text-white font-serif">Editorial Serif (Garamond/Times)</option>
                      <option value="font-sans" className="bg-zinc-900 text-white font-sans">Modern Sans (Inter/Arial)</option>
                      <option value="font-mono" className="bg-zinc-900 text-white font-mono">Mesin Tik Mono (Courier)</option>
                    </select>
                  </div>

                  <div className="h-5 w-px bg-zinc-700 hidden sm:block" />

                  {/* Text Alignment Toolbar (Rata Kiri, Tengah, Kanan, Justify) */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80 gap-0.5">
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, textAlign: 'text-left' })}
                      className={`p-1.5 rounded-md transition-colors ${articleForm.textAlign === 'text-left' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      title="Rata Kiri (Align Left)"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, textAlign: 'text-center' })}
                      className={`p-1.5 rounded-md transition-colors ${articleForm.textAlign === 'text-center' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      title="Rata Tengah (Center)"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, textAlign: 'text-right' })}
                      className={`p-1.5 rounded-md transition-colors ${articleForm.textAlign === 'text-right' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      title="Rata Kanan (Align Right)"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, textAlign: 'text-justify' })}
                      className={`p-1.5 rounded-md transition-colors ${articleForm.textAlign === 'text-justify' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                      title="Rata Kanan & Kiri (Justify)"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-5 w-px bg-zinc-700 hidden sm:block" />

                  {/* Heading Buttons */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80 gap-0.5">
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n## ', '\n', 'Judul Bagian')}
                      className="px-2 py-1 rounded text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Judul Bagian Besar (Heading 1)"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n### ', '\n', 'Subjudul')}
                      className="px-2 py-1 rounded text-[11px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Subjudul Bagian (Heading 2)"
                    >
                      H2
                    </button>
                  </div>

                  {/* Text Style: Bold, Italic, Underline, Strikethrough */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80 gap-0.5">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**', 'teks tebal')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Tebal (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*', 'teks miring')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Miring (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<u>', '</u>', 'teks bergaris bawah')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Garis Bawah (Underline)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('~~', '~~', 'teks coret')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Coret (Strikethrough)"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-5 w-px bg-zinc-700 hidden sm:block" />

                  {/* Quotes & Lists */}
                  <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80 gap-0.5">
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n> "', '"\n', 'Kutipan pernyataan pemikiran perjuangan...')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Blok Kutipan (Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n- ', '', 'Poin dialektika')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Daftar Butir (Bullet List)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n1. ', '', 'Poin argumentasi')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Daftar Angka (Numbered List)"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n---\n', '', '')}
                      className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Garis Pembatas (Divider)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Editor Writing Canvas Sheet */}
                {editorMode === 'write' ? (
                  <div className="border border-t-0 border-zinc-700 bg-[#0e0e12] rounded-b-2xl p-4 sm:p-6 shadow-inner">
                    <textarea
                      ref={contentTextareaRef}
                      rows={14}
                      required
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      placeholder="Mulai menulis naskah artikel perjuangan di sini... Gunakan toolbar di atas untuk mengatur font, perataan rata kiri-kanan, tebal, miring, dan kutipan."
                      className={`w-full min-h-[380px] bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-y text-base sm:text-lg leading-relaxed ${articleForm.fontFamily || 'font-serif'}`}
                      style={{
                        textAlign: articleForm.textAlign === 'text-justify' ? 'justify' : articleForm.textAlign === 'text-center' ? 'center' : articleForm.textAlign === 'text-right' ? 'right' : 'left'
                      }}
                    />

                    {/* Word status footer */}
                    <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <div className="flex items-center gap-3">
                        <span>{articleForm.content ? articleForm.content.trim().split(/\s+/).filter(Boolean).length : 0} kata</span>
                        <span>•</span>
                        <span>{articleForm.content.length} karakter</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="capitalize">{articleForm.fontFamily?.replace('font-', '') || 'serif'}</span>
                        <span>•</span>
                        <span className="capitalize">{articleForm.textAlign?.replace('text-', '') || 'justify'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Preview Tab */
                  <div className="border border-t-0 border-zinc-700 bg-[#0a0a0d] rounded-b-2xl p-6 sm:p-10 shadow-inner min-h-[420px]">
                    <div className="max-w-2xl mx-auto space-y-4">
                      <div className="pb-3 border-b border-zinc-800 text-xs text-zinc-500 font-mono flex items-center justify-between">
                        <span>Pratinjau Layout Pembaca:</span>
                        <span className="text-red-400 font-semibold">{articleForm.fontFamily} • {articleForm.textAlign}</span>
                      </div>
                      <div className={`${articleForm.fontFamily || 'font-serif'} ${articleForm.textAlign || 'text-justify'}`}>
                        {articleForm.content ? (
                          articleForm.content.split('\n').map((line, idx) => {
                            if (line.startsWith('## ')) {
                              return <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-3 font-editorial">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                              return <h3 key={idx} className="text-xl font-bold text-zinc-100 mt-5 mb-2 font-editorial">{line.replace('### ', '')}</h3>;
                            }
                            if (line.startsWith('> ')) {
                              return <blockquote key={idx} className="my-4 pl-4 border-l-4 border-red-600 italic text-zinc-200 bg-red-950/20 py-2 rounded-r">{line.replace('> ', '')}</blockquote>;
                            }
                            if (line.trim() === '---') {
                              return <hr key={idx} className="my-6 border-zinc-800" />;
                            }
                            if (line.startsWith('- ') || line.startsWith('• ')) {
                              return <div key={idx} className="ml-4 my-1 text-zinc-300">• {line.replace(/^[-•]\s*/, '')}</div>;
                            }
                            if (/^\d+\.\s/.test(line)) {
                              return <div key={idx} className="ml-4 my-1 text-zinc-300 font-medium">{line}</div>;
                            }
                            if (line.trim() === '') {
                              return <div key={idx} className="h-3" />;
                            }
                            return <p key={idx} className="text-zinc-300 text-base leading-relaxed mb-3">{line}</p>;
                          })
                        ) : (
                          <p className="text-zinc-600 italic">Belum ada tulisan untuk ditampilkan di pratinjau.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-900/40"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticleId ? 'Perbarui Artikel' : 'Publikasikan Artikel'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: KELOLA ZINE & E-BOOK                               */}
        {/* ========================================================= */}
        {activeTab === 'zines' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar with Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Manajemen Koleksi Zine & E-Book
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eb3d4d]/20 text-[#eb3d4d] border border-[#eb3d4d]/40">
                    ZINE COMMUNE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Arsip majalah dinding dan buku digital (e-book/PDF) yang dapat diunduh langsung oleh kader dan pembaca.
                </p>
              </div>

              {!showZineForm && (
                <button
                  type="button"
                  onClick={() => {
                    handleCancelEditZine();
                    setShowZineForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#eb3d4d] hover:bg-[#d63040] text-white transition-all shadow-md shadow-red-950/40 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Zine Baru</span>
                </button>
              )}
            </div>

            {/* Quick Stats Grid for Zines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Total Zine Terbit
                </span>
                <div className="text-2xl font-black text-white">{zines.length} Edisi</div>
                <div className="text-[11px] text-zinc-500 mt-1">Tersedia untuk pembaca</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Total Unduhan Berkas
                </span>
                <div className="text-2xl font-black text-white">
                  {zines.reduce((acc, curr) => acc + (curr.downloads || 0), 0)} Kali
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Akumulasi unduhan pembaca</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Format Berkas
                </span>
                <div className="text-2xl font-black text-white">PDF / E-Book</div>
                <div className="text-[11px] text-zinc-500 mt-1">Siap cetak mandiri</div>
              </div>
            </div>

            {/* Form Tambah / Sunting Zine */}
            {showZineForm && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-zinc-700/80 shadow-2xl">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <ArrowDownToLine className="w-5 h-5 text-[#eb3d4d]" />
                    <h3 className="text-lg font-bold text-white">
                      {editingZineId ? 'Sunting Berkas Zine' : 'Unggah Zine / E-Book Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEditZine}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Batal
                  </button>
                </div>

                <form onSubmit={handleSaveZine} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Judul Zine <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={zineForm.title}
                        onChange={(e) => setZineForm({ ...zineForm, title: e.target.value })}
                        placeholder="Contoh: Zine Perlawanan #1"
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eb3d4d]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Nomor Edisi (Badge) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={zineForm.edition}
                        onChange={(e) => setZineForm({ ...zineForm, edition: e.target.value })}
                        placeholder="Contoh: EDISI #01"
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#eb3d4d] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Deskripsi / Keterangan Zine
                    </label>
                    <textarea
                      rows={2}
                      value={zineForm.description}
                      onChange={(e) => setZineForm({ ...zineForm, description: e.target.value })}
                      placeholder="Arsip digital majalah dinding dan zine fisik dalam format gambar resolusi tinggi untuk dicetak mandiri."
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-[#eb3d4d]"
                    />
                  </div>

                  {/* Upload Cover Zine */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Gambar Cover / Sampul Zine <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Live Card Cover Preview */}
                      <div className="w-48 aspect-[16/9] rounded-xl overflow-hidden bg-black border border-zinc-700 relative shrink-0">
                        {zineForm.cover ? (
                          <img
                            src={zineForm.cover}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 text-xs">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span>Preview Cover</span>
                          </div>
                        )}
                        <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/85 text-white border border-zinc-700">
                          {zineForm.edition || 'EDISI'}
                        </span>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-dashed border-zinc-600 text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-[#eb3d4d]" />
                          <span>Unggah Gambar Cover dari Komputer / HP</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleZineCoverUpload}
                          />
                        </label>
                        <input
                          type="url"
                          value={zineForm.cover}
                          onChange={(e) => setZineForm({ ...zineForm, cover: e.target.value })}
                          placeholder="Atau tautan URL gambar (https://...)"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#eb3d4d]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Berkas Dokumen E-Book / PDF */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Berkas Dokumen E-Book / PDF <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700 hover:border-[#eb3d4d] rounded-xl bg-zinc-950/60 hover:bg-zinc-950 cursor-pointer transition-all">
                          <FileDown className="w-6 h-6 text-[#eb3d4d] mb-1.5" />
                          <span className="text-xs font-bold text-zinc-200">Unggah File PDF / Dokumen</span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">Mendukung format PDF, EPUB, dll.</span>
                          <input
                            type="file"
                            accept=".pdf,.epub,.txt"
                            className="hidden"
                            onChange={handleZineFileUpload}
                          />
                        </label>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                            Atau Tautan Download Eksternal (Google Drive / Link Direct):
                          </label>
                          <input
                            type="text"
                            value={zineForm.fileUrl}
                            onChange={(e) => setZineForm({ ...zineForm, fileUrl: e.target.value })}
                            placeholder="https://drive.google.com/..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#eb3d4d]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={zineForm.fileName}
                            onChange={(e) => setZineForm({ ...zineForm, fileName: e.target.value })}
                            placeholder="Nama file (contoh: Zine_Edisi_01.pdf)"
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-xs text-zinc-300 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={zineForm.fileSize}
                            onChange={(e) => setZineForm({ ...zineForm, fileSize: e.target.value })}
                            placeholder="Ukuran (14.2 MB)"
                            className="w-28 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-xs text-zinc-300 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={handleCancelEditZine}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#eb3d4d] hover:bg-[#d63040] text-white transition-all shadow-md shadow-red-950/40"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingZineId ? 'Simpan Perubahan Zine' : 'Terbitkan Zine Siap Unduh'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Published Zines (Matching 2-Column Front Design) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Daftar Edisi Zine Terbit ({zines.length})
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  Tampil di bawah seksi Artikel Perjuangan
                </span>
              </div>

              {zines.length === 0 ? (
                <div className="text-center py-16 px-4 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                  <FileCheck className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-zinc-300 mb-1">Belum Ada Zine Terbit</h4>
                  <p className="text-xs text-zinc-500 mb-4">Klik tombol di atas untuk mengunggah naskah zine perdana.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {zines.map((zine) => (
                    <div
                      key={zine.id}
                      className="p-5 rounded-2xl bg-black border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover image preview with badge */}
                        <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 bg-zinc-900 border border-zinc-800">
                          <img
                            src={zine.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"}
                            alt={zine.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-black/85 text-white border border-zinc-700">
                            {zine.edition}
                          </span>
                        </div>

                        <h4 className="font-mono font-bold text-center text-white text-lg mb-2">
                          {zine.title}
                        </h4>
                        <p className="text-xs font-mono text-zinc-400 text-center mb-4 line-clamp-2">
                          {zine.description || 'Arsip digital majalah dinding dan zine fisik.'}
                        </p>

                        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono space-y-1 mb-4">
                          <div className="flex justify-between text-zinc-400">
                            <span>Nama Berkas:</span>
                            <span className="text-zinc-200 font-bold truncate max-w-[180px]">{zine.fileName || 'Zine.pdf'}</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>Ukuran:</span>
                            <span className="text-zinc-200">{zine.fileSize || '12.0 MB'}</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>Total Unduhan:</span>
                            <span className="text-emerald-400 font-bold">{zine.downloads || 0} kali</span>
                          </div>
                        </div>
                      </div>

                      {/* Management Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-zinc-900">
                        <button
                          type="button"
                          onClick={() => handleStartEditZine(zine)}
                          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sunting</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteZine && onDeleteZine(zine.id)}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
