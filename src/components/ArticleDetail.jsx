import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageSquare, Bookmark, Share2, Clock, Check, Send, ShieldAlert, Sparkles } from 'lucide-react';

export function ArticleDetail({ article, onBack, onLikeArticle, isLiked, isBookmarked, onToggleBookmark, onAddComment }) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(article.id, {
      id: 'c-' + Date.now(),
      author: authorName.trim() || 'Kader Mahasiswa',
      avatar: '/images/default-avatar.png',
      date: 'Baru saja',
      content: commentText.trim()
    });

    setCommentText('');
    setAuthorName('');
  };

  // Simple Markdown parser for headers, blockquotes, bold, and bullet points
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const textAlignClass = article.textAlign || 'text-justify';
    const fontFamilyClass = article.fontFamily || '';

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 2
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-anton text-2xl sm:text-3xl text-white mt-10 mb-4 tracking-wide uppercase">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-anton text-xl sm:text-2xl text-zinc-100 mt-8 mb-3 tracking-wide uppercase">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-6 pl-5 border-l-4 border-red-600 italic text-lg sm:text-xl text-zinc-200 bg-red-950/20 py-3 rounded-r-lg font-editorial">
            {line.replace('> ', '').replace(/^"|"$/g, '')}
          </blockquote>
        );
      }
      // Divider
      if (line.trim() === '---') {
        return <hr key={idx} className="my-8 border-zinc-800" />;
      }
      // Numbered List
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-4 pl-2 my-2 text-zinc-300 leading-relaxed">
            <span className="font-bold text-red-500 mr-2">{line.split('.')[0]}.</span>
            <span>{line.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      // Bullet list
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-2.5 ml-4 my-2 text-zinc-300 leading-relaxed">
            <span className="text-red-500 mt-1">•</span>
            <span>{line.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-4" />;
      }
      // Standard paragraph with chosen alignment and font
      return (
        <p key={idx} className={`text-zinc-300 text-base sm:text-lg leading-relaxed mb-4 ${textAlignClass} ${fontFamilyClass}`}>
          {line}
        </p>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Beranda Esai</span>
      </button>

      {/* Article Date & Read Time */}
      <div className="flex items-center gap-3 mb-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{article.readTime || `${Math.max(1, Math.ceil((article.content?.split(/\s+/).length || 200) / 200))} min baca`}</span>
        </span>
        <span>•</span>
        <span>{article.date}</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wide uppercase leading-[1.08] mb-4">
        {article.title}
      </h1>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed mb-8">
          {article.subtitle}
        </p>
      )}

      {/* Author Card (Substack Style) */}
      <div className="flex items-center justify-between py-4 border-y border-zinc-800 mb-8">
        <div className="flex items-center gap-3.5">
          <img 
            src={article.author?.avatar && !article.author.avatar.includes('unsplash') ? article.author.avatar : "/images/default-avatar.png"} 
            alt={article.author?.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-red-600/40"
          />
          <div>
            <h4 className="text-sm sm:text-base font-bold text-zinc-100">
              {article.author?.name || "Kader IMM"}
            </h4>
            <p className="text-xs text-zinc-400">
              {article.author?.role || "Ikatan Mahasiswa Muhammadiyah FEB"}
            </p>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLikeArticle(article.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isLiked
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-950/40'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
            <span>{article.likes || 0}</span>
          </button>

          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`p-2 rounded-full border transition-all ${
              isBookmarked
                ? 'bg-zinc-800 text-red-500 border-red-600/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
            title={isBookmarked ? "Tersimpan di daftar baca" : "Simpan untuk nanti"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-red-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-700 hover:text-white transition-all"
            title="Bagikan esai"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Featured Thumbnail */}
      {article.thumbnail && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl">
          <img 
            src={article.thumbnail} 
            alt={article.title} 
            className="w-full h-auto max-h-[500px] object-cover"
          />
          <p className="text-center text-xs text-zinc-500 py-2.5 bg-zinc-950/60 border-t border-zinc-800">
            Dokumentasi & Arsip Kolektif IMM FEB
          </p>
        </div>
      )}

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-zinc-300 font-normal">
        {renderFormattedContent(article.content)}
      </div>

      {/* Bottom Author Bio Card */}
      <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#111114] border border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src={article.author?.avatar && !article.author.avatar.includes('unsplash') ? article.author.avatar : "/images/default-avatar.png"} 
            alt={article.author?.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
          />
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-1">
              Ditulis oleh {article.author?.name}
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {article.author?.bio || article.authorBio || "Kader aktif Ikatan Mahasiswa Muhammadiyah Komisariat Fakultas Ekonomi dan Bisnis. Berkomitmen merawat tradisi intelektual, dialektika kritis, dan pengabdian umat."}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-14 pt-10 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-anton text-2xl uppercase tracking-wide text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-500" />
            <span>Ruang Dialektika ({article.comments?.length || 0})</span>
          </h3>
          <span className="text-xs text-zinc-500">Tanggapan & Diskusi Terbuka</span>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmitComment} className="mb-10 p-5 rounded-2xl bg-[#121216] border border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">Sampaikan Gagasan atau Kritik Anda</h4>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nama / Identitas Anda (Contoh: Kader IMM FEB Angkatan 2024)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="mb-3">
            <textarea
              rows={3}
              required
              placeholder="Tuliskan argumen, catatan, atau tanggapan kritis..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-950/40"
            >
              <span>Kirim Tanggapan</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((comment) => (
              <div key={comment.id} className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={comment.avatar && !comment.avatar.includes('unsplash') ? comment.avatar : "/images/default-avatar.png"} 
                    alt={comment.author} 
                    className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-200">{comment.author}</span>
                    <span className="text-[11px] text-zinc-500 ml-2">{comment.date}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed pl-10">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500 italic text-center py-6">
              Belum ada tanggapan untuk esai ini. Jadilah yang pertama menyalakan diskursus!
            </p>
          )}
        </div>
      </section>

    </article>
  );
}
