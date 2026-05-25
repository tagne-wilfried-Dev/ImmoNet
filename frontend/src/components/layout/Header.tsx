import React, { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';

interface HeaderProps {
    currentExplore: 'rent' | 'sell';
    onNavigate: (type: 'rent' | 'sell') => void;
}

const Header: React.FC<HeaderProps> = ({ currentExplore, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-cyan-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <span className="text-white font-display font-bold text-2xl tracking-tighter">I</span>
            </div>
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                ImmoNet
              </h1>
              <p className="text-[10px] text-cyan-600 -mt-1 font-medium">Immobilier • Connecté</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button 
                onClick={() => onNavigate('sell')}
                className={`transition-colors duration-200 ${
                    currentExplore === 'sell'
                    ? 'text-cyan-600 font-semibold' 
                    : 'text-slate-700 hover:text-cyan-600'
                    }`}
                >
                À Vendre
            </button>
            <button 
                onClick={() => onNavigate('rent')}
                className={`transition-colors duration-200 ${
                    currentExplore === 'rent'
                    ? 'text-cyan-600 font-semibold' 
                    : 'text-slate-700 hover:text-cyan-600'
                    }`}
                >
                À Louer
            </button>
            <button className="text-slate-700 hover:text-cyan-600 transition-colors duration-200">
              Annonces
            </button>
            <button className="text-slate-700 hover:text-cyan-600 transition-colors duration-200">
              Propriétaires
            </button>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-all duration-200">
              Se connecter
            </button>

            <button className="flex items-center gap-2 px-7 py-3 bg-linear-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-medium rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 hover:scale-[1.03] active:scale-95">
              <Plus className="w-5 h-5" />
              Publier une annonce
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-100 bg-white">
          <div className="px-6 py-8 space-y-6">
            <button 
              onClick={() => { onNavigate('sell'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-3 text-lg text-slate-700 hover:text-cyan-600 font-medium"
            >
              À Vendre
            </button>
            <button 
              onClick={() => { onNavigate('rent'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-3 text-lg text-slate-700 hover:text-cyan-600 font-medium"
            >
              À Louer
            </button>
            <button className="block w-full text-left  py-3 text-lg text-slate-700 hover:text-cyan-600 font-medium">
              Annonces
            </button>
            <button className="block w-full text-left  py-3 text-lg text-slate-700 hover:text-cyan-600 font-medium">
              Propriétaires
            </button>
            
            <div className="pt-6 border-t border-cyan-100 space-y-4">
              <button className="w-full py-4 text-slate-700 font-medium text-lg border border-cyan-200 rounded-2xl hover:bg-cyan-50">
                Se connecter
              </button>
              <button className="w-full py-4 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-medium text-lg rounded-2xl flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Publier une annonce
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;