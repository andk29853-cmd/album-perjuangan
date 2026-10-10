import React from 'react';

export function Footer({ siteConfig, onOpenAdminLogin }) {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer: Left Logo, Right Description */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          
          {/* Left: Footer Logo */}
          <div className="shrink-0">
            <img 
              src={siteConfig?.footerLogo || "/images/logo-commune.png"} 
              alt={siteConfig?.siteName || "Commune Logo"} 
              className="h-16 sm:h-20 md:h-24 max-w-[320px] w-auto object-contain"
            />
          </div>

          {/* Right: Footer Description */}
          <div className="max-w-2xl md:text-right">
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {siteConfig?.footerDescription || "Sebuah ikhtiar literasi dan advokasi profetik dalam mengartikulasikan keresahan sosial, ketimpangan ekonomi, serta meneguhkan kembali Tri Kompetensi Dasar: Religiusitas, Intelektualitas, dan Humanitas."}
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Secret Admin Trigger */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} {siteConfig?.siteName || "Album Perjuangan Commune"}. Dirawat oleh Kader IMM FEB.
          </p>
          <div className="flex items-center gap-1">
            <span 
              onClick={onOpenAdminLogin}
              className="cursor-pointer"
            >
              Ditegakkan dengan cinta, akal sehat, dan bara perjuangan.
            </span>
            <span className="text-red-500">✦</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
