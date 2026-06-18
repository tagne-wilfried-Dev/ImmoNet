import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Soft Light Gradient Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{ 
          background: 'radial-gradient(circle at top right, var(--primary-100) 0%, transparent 40%), radial-gradient(circle at bottom left, var(--primary-50) 0%, transparent 40%)' 
        }} 
      />

      {/* Decorative Light Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Auth Card Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo ImmoNet - Version Light */}
        <div className="flex justify-center mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-slate-900 font-bold text-2xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Immo<span className="text-cyan-600">Net</span>
            </span>
          </div>
        </div>

        {/* Card principale - Light Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          {children}
        </div>

        {/* Footer légal */}
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          © 2026 ImmoNet · Plateforme Immobilière Intelligente
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
