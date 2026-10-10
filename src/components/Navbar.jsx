import React from 'react';
import { Sparkles } from 'lucide-react';

export function Navbar({ siteConfig, onViewHome }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Left: Image 2 Logo (ALBUM PERJUANGAN COMMUNE - Transparent & No Border) */}
          <div className="flex items-center">
            <button 
              onClick={onViewHome}
              className="group flex items-center focus:outline-none"
            >
              <img 
                src="/images/logo-commune.png" 
                alt={siteConfig.siteName || "ALBUM PERJUANGAN COMMUNE"} 
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          </div>


          {/* Right: Join Commune Link Button -> Direct to Instagram */}
          <div className="flex items-center">
            <a
              href={siteConfig?.joinCommuneUrl || "https://www.instagram.com/album.perjuangan?cplk=MTJtOGdsbWF0N2FuOQ=="}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-black hover:bg-[#eb3d4d] hover:text-white transition-all duration-200 shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{siteConfig?.joinButtonText || "Join Commune"}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
