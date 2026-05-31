import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Gradient Hero Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#020617] via-[#042f3d] to-[#064e6b]" />
      
      {/* Decorative Cyan Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[rgba(34,211,238,0.15)] rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Glass Card */}
      <div className="relative w-full max-w-md bg-[linear-gradient(145deg,rgba(8,145,178,0.12)_0%,rgba(34,211,238,0.05)_100%)] backdrop-blur-xl border border-[rgba(34,211,238,0.12)] rounded-[24px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6)] z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;