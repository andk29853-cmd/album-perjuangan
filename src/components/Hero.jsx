import React from 'react';

export function Hero({ siteConfig, onOpenAdmin }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-14 md:pt-20 md:pb-20 border-b border-zinc-800/80 bg-gradient-to-b from-black via-[#09090b] to-[#0e0e11]">
      {/* Background ambient red-black glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Center Emblem Icon (Editable via Admin) */}
        <div className="flex justify-center mb-6">
          <div className="transition-transform duration-300 hover:scale-105">
            <img 
              src={siteConfig?.heroEmblem || "/images/cat-head.png"} 
              alt="Commune Cat Emblem" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
            />
          </div>
        </div>

        {/* Main Headline (User requested: can be edited via Admin) */}
        <h1 className="font-anton text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-white tracking-wide uppercase leading-[1.06] mb-6 drop-shadow-md">
          {siteConfig.heroTitle || "Perjuangan, Kata & Suara Marjinal."}
        </h1>

        {/* Hero Description (User requested: can be edited via Admin) */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed">
          {siteConfig.heroDescription || "Ruang dialektika, tulisan kritis, dan dokumentasi pemikiran intelektual kolektif gerakan mahasiswa dan pemuda pergerakan."}
        </p>

      </div>
    </section>
  );
}
