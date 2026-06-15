import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService } from '@/services/UserService'
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Plus,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderConnectedProps {
  userName: string;
  userRole: 'CLIENT' | 'PRO' | 'ADMIN';
  notificationCount: number;
  onToggleSidebar: () => void;
  onOpenNotifications: () => void; 
}

const HeaderConnected: React.FC<HeaderConnectedProps> = ({
  userName,
  userRole,
  notificationCount,
  onToggleSidebar,
  onOpenNotifications,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setTimeout(async()=>await userService.logout(),2000)
    
    navigate('/login');
  };

  const handlePublish = () => {
    if (userRole === 'PRO') {
      navigate('/publier');
    } else {
      navigate('/devenir-pro');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Gauche : Logo + Toggle Sidebar + Nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-600 to-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <span className="text-white font-display font-bold text-lg tracking-tighter">
                I
              </span>
            </div>
            <span className="font-display text-xl font-bold text-slate-900 hidden sm:block">
              ImmoNet
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Navigation principale">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${location.pathname === '/' ? 'text-cyan-700 bg-cyan-50 font-semibold' : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50'}`}
            >
              Accueil
            </button>
            <button
              onClick={() => navigate('/explore/vente')}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${location.pathname.startsWith('/explore/vente') ? 'text-cyan-700 bg-cyan-50 font-semibold' : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50'}`}
            >
              À Vendre
            </button>
            <button
              onClick={() => navigate('/explore/louer')}
              className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${location.pathname.startsWith('/explore/louer') ? 'text-cyan-700 bg-cyan-50 font-semibold' : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50'}`}
            >
              À Louer
            </button>
            <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-full transition-colors">
              Notaires
            </button>
            <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-full transition-colors">
              Location meublée
            </button>
          </nav>
        </div>

        {/* Droite : Actions + Profil */}
        <div className="flex items-center gap-3">
          {/* Bouton Publier */}
          <button
            onClick={handlePublish}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-sm font-medium rounded-full shadow-accent hover:shadow-accent-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={16} />
            <span>Publier</span>
          </button>

          {/* Notifications */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Ouvrir les notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profil Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500 capitalize">{userRole.toLowerCase()}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <User size={16} />
                    <a href='/profile'>Mon profil</a>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings size={16} />
                    Paramètres
                  </button>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderConnected;