import React, { useState } from 'react';
import { Download, ArrowDownToLine, FileCheck, Check, Sparkles } from 'lucide-react';

export function ZineSection({ zines = [], siteConfig = {}, onDownloadZine }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const handleDownloadClick = (zine) => {
    setDownloadingId(zine.id);

    if (onDownloadZine) {
      onDownloadZine(zine.id);
    }

    // Trigger actual browser download
    setTimeout(() => {
      try {
        if (zine.fileData) {
          // Download base64 data
          const link = document.createElement('a');
          link.href = zine.fileData;
          link.download = zine.fileName || `${zine.title.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (zine.fileUrl && zine.fileUrl !== '#') {
          // Download or open external URL
          const link = document.createElement('a');
          link.href = zine.fileUrl;
          link.download = zine.fileName || `${zine.title.replace(/\s+/g, '_')}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // If mock/demo without binary, create a sample printable text file or simulated PDF download
          const blob = new Blob([
            `COMMUNE ARCHIVE & ZINE DIGITAL - IMM FEB\n\n` +
            `Edisi: ${zine.edition}\n` +
            `Judul: ${zine.title}\n` +
            `Deskripsi: ${zine.description || 'Arsip zine digital Ikatan Mahasiswa Muhammadiyah FEB.'}\n\n` +
            `Dokumentasi ini siap dicetak secara mandiri oleh kader dan simpatisan perjuangan.`
          ], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = zine.fileName || `${zine.title.replace(/\s+/g, '_')}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        console.error('Download error:', err);
      }

      setDownloadingId(null);
      setDownloadSuccessId(zine.id);
      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 600);
  };

  return (
    <section id="zine-download" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      {/* Top Header outside container matching design */}
      <div className="mb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <ArrowDownToLine className="w-6 h-6 text-[#eb3d4d]" />
          <h2 className="font-anton text-2xl sm:text-3xl text-white tracking-wider uppercase">
            ZINE DOWNLOAD
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-zinc-500">
          Zine Commune
        </p>
      </div>

      {/* Thin line divider */}
      <div className="h-px bg-zinc-800/80 mb-8 sm:mb-10" />

      {/* Zine Content Area (Tanpa border kotak besar) */}
      <div className="text-center relative py-2">
        
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#eb3d4d]/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Pill Badge at Center */}
        <div className="inline-block mb-3.5 relative">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eb3d4d] text-white shadow-md inline-block">
            {siteConfig?.zineSectionBadge || 'ZINE COMMUNE'}
          </span>
        </div>

        {/* Center Title */}
        <h3 className="font-anton text-2xl sm:text-3xl md:text-4xl text-white tracking-wide uppercase mb-3 relative">
          {siteConfig?.zineSectionTitle || 'KOLEKSI ZINE SIAP UNDUH'}
        </h3>

        {/* Center Subtitle */}
        <p className="font-mono text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 relative">
          {siteConfig?.zineSectionSubtitle || 'Arsip digital majalah dinding dan zine fisik dalam format gambar resolusi tinggi untuk dicetak mandiri.'}
        </p>

        {/* Empty state if no zines */}
        {zines.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center max-w-md mx-auto">
            <FileCheck className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm font-medium">Belum ada berkas zine yang diunggah.</p>
            <p className="text-zinc-500 text-xs mt-1">Admin dapat mengunggah zine baru melalui Dasbor Admin.</p>
          </div>
        ) : (
          /* Zines Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left relative">
            {zines.map((zine) => {
              const isDownloading = downloadingId === zine.id;
              const isDownloaded = downloadSuccessId === zine.id;

              return (
                <div 
                  key={zine.id}
                  className="bg-black border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-zinc-700 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Thumbnail / Cover Aspect 16:9 with Edition Badge */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 bg-zinc-900 border border-zinc-800/80">
                    <img 
                      src={zine.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"} 
                      alt={zine.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Top Right Edition Badge */}
                    <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-black/85 text-white border border-zinc-700/80 backdrop-blur-sm tracking-wider">
                      {zine.edition || 'EDISI'}
                    </span>

                    {/* File info pill bottom left */}
                    {zine.fileSize && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-zinc-300 border border-zinc-800/80 backdrop-blur-sm">
                        {zine.fileSize}
                      </span>
                    )}
                  </div>

                  {/* Title under image */}
                  <h4 className="font-mono font-bold text-center text-white text-base sm:text-lg my-3 tracking-wide group-hover:text-red-400 transition-colors">
                    {zine.title}
                  </h4>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadClick(zine)}
                    disabled={isDownloading}
                    className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                      isDownloaded 
                        ? 'bg-emerald-600 text-white'
                        : isDownloading 
                        ? 'bg-[#b82937] text-white/80 cursor-wait' 
                        : 'bg-[#eb3d4d] hover:bg-[#d63040] text-white shadow-red-950/30'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>BERHASIL DIUNDUH</span>
                      </>
                    ) : isDownloading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>MENGUNDUH...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>UNDUH ZINE</span>
                      </>
                    )}
                  </button>

                  {/* Download stats footer */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-3 mt-3 border-t border-zinc-900">
                    <span>Format: PDF / E-Book</span>
                    <span>{zine.downloads || 0} Kali Diunduh</span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
