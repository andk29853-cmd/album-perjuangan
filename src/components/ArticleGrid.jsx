import React, { useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { BookOpen, Search, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export function ArticleGrid({ 
  articles, 
  onSelectArticle, 
  onLikeArticle, 
  onEditArticle, 
  likedArticles, 
  bookmarkedArticles, 
  onToggleBookmark,
  siteConfig
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter by search query
  const filtered = articles.filter(art => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      art.title?.toLowerCase().includes(q) ||
      art.subtitle?.toLowerCase().includes(q) ||
      art.excerpt?.toLowerCase().includes(q) ||
      art.author?.name?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * itemsPerPage;
  const displayedArticles = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const el = document.getElementById('artikel-perjuangan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="artikel-perjuangan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      
      {/* Subjudul di Atas Artikel (Artikel Perjuangan) + Instant Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 mb-8 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 mb-1.5">
            <Flame className="w-4 h-4 text-red-500 shrink-0" />
            <span>Koleksi Tulisan & Arsip Pemikiran</span>
          </div>
          <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-wide">
            {siteConfig?.articlesSectionTitle || "Artikel Perjuangan"}
          </h2>
        </div>

        {/* Search Bar + Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              placeholder="Cari esai atau kader penulis..."
              className="w-full sm:w-64 bg-[#111114] border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
            />
            {localSearch && (
              <button
                onClick={() => { setLocalSearch(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {displayedArticles.length === 0 ? (
        <div className="text-center py-20 px-4 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          {articles.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-zinc-300 mb-1">Belum Ada Tulisan yang Diterbitkan</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto mb-2">
                Ruang dialektika dan arsip tulisan siap diisi. Kader redaksi dapat mulai menulis dan menerbitkan naskah artikel melalui Dasbor Admin.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-zinc-300 mb-1">Belum Ada Tulisan yang Ditemukan</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto mb-4">
                Tidak menemukan artikel dengan kata kunci "{localSearch}".
              </p>
              <button
                onClick={() => { setLocalSearch(''); setCurrentPage(1); }}
                className="px-4 py-2 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Tampilkan Semua Artikel
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* THE 2-BOX COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelectArticle={onSelectArticle}
                onLikeArticle={onLikeArticle}
                onEditArticle={onEditArticle}
                isLiked={likedArticles.includes(article.id)}
                isBookmarked={bookmarkedArticles.includes(article.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>

          {/* Structured Pagination (Prev, 1, 2, 3..., Next) */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400 font-medium">
                Menampilkan <span className="text-white font-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)}</span> dari <span className="text-white font-bold">{filtered.length}</span> artikel
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentSafePage - 1)}
                  disabled={currentSafePage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    currentSafePage === 1
                      ? 'border-zinc-800/50 text-zinc-600 cursor-not-allowed bg-zinc-950/40'
                      : 'border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 bg-[#111114]'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      pageNum === currentSafePage
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'bg-[#111114] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentSafePage + 1)}
                  disabled={currentSafePage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    currentSafePage === totalPages
                      ? 'border-zinc-800/50 text-zinc-600 cursor-not-allowed bg-zinc-950/40'
                      : 'border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 bg-[#111114]'
                  }`}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </section>
  );
}
