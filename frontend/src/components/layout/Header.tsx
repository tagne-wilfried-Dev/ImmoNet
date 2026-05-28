import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Plus, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { defineConfig } from 'vite';

interface HeaderProps {
  currentExplore: 'rent' | 'sell';
  onNavigate: (type: 'rent' | 'sell') => void;
}

const Header: React.FC<HeaderProps> = ({ currentExplore, onNavigate=() => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verrouillage du scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavigateAndClose = (type: 'rent' | 'sell') => {
    onNavigate(type);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handlePublish = () => {
    setIsMobileMenuOpen(false);
    // TODO : vérifier l'état d'auth quand le store Redux sera en place
    // Si connecté en tant que propriétaire → /publier
    // Sinon → /login avec redirect
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo + Tagline */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="Retour à l'accueil ImmoNet"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-br from-cyan-600 to-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-200">
              <span className="text-white font-display font-bold text-xl sm:text-2xl tracking-tighter">
                I
              </span>
            </div>
            <div className="text-left">
              <h1 className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-bold tracking-tight text-slate-900 leading-none">
                ImmoNet
              </h1>
              <p className="text-[10px] sm:text-[11px] text-cyan-700 font-medium hidden sm:block mt-0.5">
                Trouvez votre chez-vous.
              </p>
            </div>
          </button>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Navigation principale">
            <button
              onClick={() => onNavigate('sell')}
              className={`relative px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer ${currentExplore === 'sell'
                  ? 'text-cyan-700 font-semibold bg-cyan-50'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
                }`}
              aria-current={currentExplore === 'sell' ? 'page' : undefined}
            >
              À Vendre
            </button>
            <button
              onClick={() => onNavigate('rent')}
              className={`relative px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer ${currentExplore === 'rent'
                  ? 'text-cyan-700 font-semibold bg-cyan-50'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
                }`}
              aria-current={currentExplore === 'rent' ? 'page' : undefined}
            >
              À Louer
            </button>
            <button
              className='relative px-4 py-2 rounded-full transition-colors duration-200 cursor-not-allowed text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            >
              À propos
            </button>
            <button
              className='relative px-4 py-2 rounded-full transition-colors duration-200 cursor-not-allowed text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            >
              Nous ontacter
            </button>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="flex items-center gap-1 px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-full transition-all duration-200"
            >
              <User />
              Se connecter
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 lg:px-6 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-sm font-medium rounded-full shadow-[0_4px_14px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              <span className="hidden lg:inline">Publier une annonce</span>
              <span className="lg:hidden">Publier</span>
            </button>
          </div>

          {/* Burger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.0, 0.0, 0.2, 1] }}
              className="md:hidden border-t border-slate-200 bg-white absolute top-full left-0 right-0 z-50 shadow-lg"
              aria-label="Menu mobile"
            >
              <div className="px-4 sm:px-6 py-5 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Navigation */}
                <button
                  onClick={() => handleNavigateAndClose('sell')}
                  className={`flex items-center w-full text-left px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${currentExplore === 'sell'
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                >
                  À Vendre
                </button>
                <button
                  onClick={() => handleNavigateAndClose('rent')}
                  className={`flex items-center w-full text-left px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${currentExplore === 'rent'
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                >
                  À Louer
                </button>
                <button
                  className={`flex items-center w-full text-left px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${currentExplore === 'rent'
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                >
                  A propos
                </button>
                <button
                  
                  className={`flex items-center w-full text-left px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${currentExplore === 'rent'
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                >
                  Nous Contacter
                </button>

                {/* Actions */}
                <div className="pt-4 mt-3 border-t border-slate-200 space-y-2">
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center gap-2 w-full py-3.5 text-slate-700 font-medium text-base border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-cyan-200 transition-colors"
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    Se connecter
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-500 text-white font-medium text-base rounded-xl shadow-[0_4px_14px_rgba(8,145,178,0.25)] active:scale-[0.98] transition-transform"
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    Publier une annonce
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;