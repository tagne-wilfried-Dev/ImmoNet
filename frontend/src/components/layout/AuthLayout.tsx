import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Gradient Hero Background — bg-linear-to-br est invalide en Tailwind, on utilise bg-linear-to-br */}
      <div className="absolute inset-0 bg-linear-to-br from-[#020617] via-[#042f3d] to-[#064e6b]" />

      {/* Decorative Cyan Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[rgba(34,211,238,0.12)] rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Glass Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo ImmoNet au-dessus de la card */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center shadow-[0_4px_14px_rgba(34,211,238,0.4)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Immo<span className="text-[#22d3ee]">Net</span>
            </span>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-[linear-gradient(145deg,rgba(8,145,178,0.12)_0%,rgba(34,211,238,0.05)_100%)] backdrop-blur-xl border border-[rgba(34,211,238,0.12)] rounded-[24px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
          {children}
        </div>

        {/* Footer légal */}
        <p className="text-center text-[#475569] text-xs mt-5">
          © 2026 ImmoNet · Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
