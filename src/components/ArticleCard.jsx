import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, Share2, Clock, Check } from 'lucide-react';

export function ArticleCard({ article, onSelectArticle, onLikeArticle, onEditArticle, isLiked, isBookmarked, onToggleBookmark }) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + article.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onLikeArticle(article.id);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    onToggleBookmark(article.id);
  };

  return (
    <article 
      onClick={() => onSelectArticle(article)}
      className="group cursor-pointer flex flex-col justify-between h-full bg-[#111114] hover:bg-[#15151a] border border-zinc-800/90 hover:border-red-600/50 rounded-2xl p-6 sm:p-7 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-red-950/20 transform hover:-translate-y-1 relative"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>

        {/* Thumbnail Image (Substack card style) */}
        {article.thumbnail && (
          <div className="relative mb-5 overflow-hidden rounded-xl aspect-[16/9] bg-zinc-900 border border-zinc-800">
            <img 
              src={article.thumbnail} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {article.featured && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white border border-red-600 backdrop-blur-sm">
                Pilihan Redaksi
              </span>
            )}
          </div>
        )}

        {/* Headline / Title */}
        <h2 className="font-anton text-xl sm:text-2xl text-white group-hover:text-red-400 transition-colors leading-snug tracking-wide uppercase mb-2.5">
          {article.title}
        </h2>

        {/* Excerpt / Subtitle */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {article.excerpt || article.subtitle}
        </p>
      </div>

      {/* Bottom Section: Author & Interaction Bar */}
      <div className="pt-4 border-t border-zinc-800/80 mt-auto">
        <div className="flex items-center justify-between">
          
          {/* Author avatar & info */}
          <div className="flex items-center gap-3">
            <img 
              src={article.author?.avatar && !article.author.avatar.includes('unsplash') ? article.author.avatar : "/images/default-avatar.png"} 
              alt={article.author?.name} 
              className="w-8 h-8 rounded-full object-cover border border-zinc-700"
            />
            <div>
              <p className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                {article.author?.name || "Kader IMM"}
              </p>
              <p className="text-[11px] text-zinc-500">
                {article.date}
              </p>
            </div>
          </div>

          {/* Action icons (Likes, Comments, Bookmark, Share) */}
          <div className="flex items-center gap-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors ${
                isLiked 
                  ? 'text-red-500 bg-red-950/40' 
                  : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
              }`}
              title="Apresiasi tulisan"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              <span>{article.likes || 0}</span>
            </button>

            {/* Comment count */}
            <div className="flex items-center gap-1 text-xs text-zinc-500 px-1.5 py-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{article.comments?.length || article.commentsCount || 0}</span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isBookmarked 
                  ? 'text-red-400 bg-red-950/30' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title={isBookmarked ? "Tersimpan" : "Simpan tulisan"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-red-500' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Salin tautan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>
    </article>
  );
}
