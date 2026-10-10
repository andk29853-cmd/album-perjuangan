import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, ArrowRight, User } from 'lucide-react';

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Default credentials: username 'admin', password 'admin', 'perjuangan2026', 'commune2026', or '123456'
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if ((trimmedUser === 'admin' && (trimmedPass === 'admin' || trimmedPass === 'perjuangan2026' || trimmedPass === 'commune2026' || trimmedPass === '123456')) ||
        (trimmedUser === 'redaksi' && (trimmedPass === 'redaksi' || trimmedPass === 'perjuangan'))) {
      onLoginSuccess();
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Kredensial tidak valid. Silakan periksa username dan kata sandi Anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#121215] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 text-left overflow-hidden">
        
        {/* Decorative ambient subtle glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/15 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/60 text-red-500 flex items-center justify-center mb-4 shadow-inner">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="font-editorial text-2xl font-bold text-white mb-1">
          Akses Ruang Redaksi
        </h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Silakan masuk dengan kredensial administrator untuk mengelola konten dan artikel Album Perjuangan Commune.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                autoFocus
                placeholder="Username admin..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="Kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-950/40"
          >
            <span>Masuk ke Panel Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-zinc-500 text-center pt-2">
            Default demo: username <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">admin</code> • kata sandi <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">admin</code>
          </p>
        </form>

      </div>
    </div>
  );
}
