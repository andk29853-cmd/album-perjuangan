import React from 'react';

export function Footer({ siteConfig, onOpenAdminLogin }) {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Logo & Vision */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-commune.png" 
                alt="Commune Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Sebuah ikhtiar literasi dan advokasi profetik dalam mengartikulasikan keresahan sosial, ketimpangan ekonomi, serta meneguhkan kembali Tri Kompetensi Dasar: Religiusitas, Intelektualitas, dan Humanitas.
            </p>
          </div>

          {/* Column 2: Nilai & Haluan */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Nilai & Haluan
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><span className="text-zinc-400">Religiusitas Progresif</span></li>
              <li><span className="text-zinc-400">Intelektualitas Kritis</span></li>
              <li><span className="text-zinc-400">Humanitas Profetik</span></li>
              <li><span className="text-zinc-400">Teologi Al-Ma'un</span></li>
              <li><span className="text-zinc-400">Ekonomi Kerakyatan</span></li>
            </ul>
          </div>

          {/* Column 3: Ruang Redaksi */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ruang Redaksi
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><span className="hover:text-zinc-200 cursor-pointer">Kirim Naskah Esai</span></li>
              <li><span className="hover:text-zinc-200 cursor-pointer">Pedoman Penulisan Kader</span></li>
              <li><span className="hover:text-zinc-200 cursor-pointer">Tentang Kolektif Commune</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} Album Perjuangan Commune. Dirawat oleh Kader IMM FEB.
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
