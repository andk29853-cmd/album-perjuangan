import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export function SubscribeModal({ isOpen, onClose, siteConfig, onSubscribe }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onSubscribe(email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121215] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Commune Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#09090b] border border-zinc-800 mx-auto mb-4 p-3 shadow-xl flex items-center justify-center">
          <img 
            src="/images/cat-emblem.png" 
            alt="Commune Emblem" 
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="font-editorial text-2xl font-bold text-white mb-2">
          Bergabung dengan Commune
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Dapatkan setiap rilisan esai, risalah ekonomi, dan manifesto pergerakan IMM FEB langsung ke kotak masuk surel Anda. Tanpa spam, sepenuhnya independen.
        </p>

        {subscribed ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-green-400 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-red-500" />
            <p className="font-bold text-sm text-white">Selamat Bergabung dalam Barisan!</p>
            <p className="text-xs text-zinc-400">Surel konfirmasi buletin telah kami kirimkan.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nama lengkap / Nama pena"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
            <input
              type="email"
              required
              placeholder="Alamat email Anda..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white hover:bg-red-600 text-black hover:text-white transition-all duration-200 shadow-lg shadow-black/40"
            >
              <span>Langganan Sekarang</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Privasi terjaga. Berhenti berlangganan kapan saja.</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
