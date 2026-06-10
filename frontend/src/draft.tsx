import { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Plus,
  Menu,
  X,
  User,
  Home,
  Key,
  FileText,
  Users,
  LogOut,
  Settings,
  Heart,
  Search,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// NOTIFICATION MODAL
// ============================================================
const NotificationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const notifications = [
    { id: 1, title: "Nouvelle offre reçue", desc: "Villa à Bastos - 85M FCFA", time: "Il y a 5 min", unread: true },
    { id: 2, title: "Visite programmée", desc: "Appartement Akwa demain à 14h", time: "Il y a 1h", unread: true },
    { id: 3, title: "Message de Jean K.", desc: "Bonjour, je suis intéressé par...", time: "Il y a 3h", unread: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-cyan-100 z-50 overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-cyan-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Notifications</h3>
              <button onClick={onClose} className="text-xs text-cyan-600 hover:underline">Tout marquer lu</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 sm:px-5 py-3 hover:bg-cyan-50/50 cursor-pointer border-b border-slate-50 last:border-0 ${n.unread ? 'bg-cyan-50/30' : ''}`}>
                  <div className="flex items-start gap-3">
                    {n.unread && <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-slate-600 truncate mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-cyan-50 bg-slate-50/50">
              <button className="w-full text-xs sm:text-sm text-cyan-600 font-medium hover:underline">Voir toutes les notifications</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================
// DASHBOARD HEADER (Responsive + Hamburger)
// ============================================================
const DashboardHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: "À Vendre", icon: Home },
    { label: "À Louer", icon: Key },
    { label: "Annonces", icon: FileText },
    { label: "Propriétaires", icon: Users },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-cyan-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span className="text-white font-bold text-base sm:text-xl">I</span>
            </div>
            <span className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-900 tracking-tight">
              ImmoNet
            </span>
          </div>

          {/* Navigation Desktop (hidden < md) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm font-medium">
            {navItems.map((item) => (
              <a key={item.label} href="#" className="text-slate-700 hover:text-cyan-600 transition-colors whitespace-nowrap">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <button className="hidden lg:flex items-center gap-2 px-4 xl:px-6 py-2 xl:py-2.5 bg-linear-to-r from-cyan-600 to-cyan-400 text-white text-xs xl:text-sm font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap">
              <Plus className="w-4 h-4 xl:w-5 xl:h-5" />
              Publier une annonce
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="relative p-2 lg:p-3 hover:bg-cyan-50 rounded-xl lg:rounded-2xl transition-colors"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-slate-700" />
                <span className="absolute top-1 right-1 lg:top-1.5 lg:right-1.5 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-red-500 text-[9px] lg:text-[10px] text-white rounded-full flex items-center justify-center font-medium border-2 border-white">
                  3
                </span>
              </button>
              <NotificationModal 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>

            {/* Profil Utilisateur */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 pr-1.5 lg:pr-2 py-1 lg:py-1.5 hover:bg-cyan-50 rounded-xl lg:rounded-2xl transition-colors"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-xs lg:text-sm font-semibold shrink-0">
                  WS
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs xl:text-sm font-medium text-slate-900">William Smith</p>
                  <p className="text-[10px] xl:text-xs text-slate-500 -mt-0.5">Propriétaire</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cyan-100 py-2 z-50"
                  >
                    <div className="px-5 py-3 border-b border-cyan-50">
                      <p className="font-medium text-sm text-slate-900">William Smith</p>
                      <p className="text-xs text-slate-500 mt-0.5">william.smith@immonet.cm</p>
                    </div>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 hover:bg-slate-50 text-sm text-slate-700">
                      <User className="w-4 h-4" /> Mon Profil
                    </a>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 hover:bg-slate-50 text-sm text-slate-700">
                      <FileText className="w-4 h-4" /> Mes Annonces
                    </a>
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 hover:bg-slate-50 text-sm text-slate-700">
                      <Settings className="w-4 h-4" /> Paramètres
                    </a>
                    <div className="border-t border-cyan-50 my-1" />
                    <a href="#" className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 text-sm">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Actions (< md) */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2">
            <button className="relative p-2 hover:bg-cyan-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center font-medium border-2 border-white">3</span>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-cyan-100 bg-white overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href="#"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </motion.a>
                );
              })}

              <div className="pt-4 mt-4 border-t border-cyan-100 space-y-2">
                <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-semibold shrink-0">
                    WS
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">William Smith</p>
                    <p className="text-xs text-slate-500 truncate">Propriétaire</p>
                  </div>
                </div>

                <a href="#" className="flex items-center gap-3 px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                  <User className="w-5 h-5" /> Mon Profil
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                  <FileText className="w-5 h-5" /> Mes Annonces
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl">
                  <Settings className="w-5 h-5" /> Paramètres
                </a>

                <button className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20">
                  <Plus className="w-5 h-5" />
                  Publier une annonce
                </button>

                <a href="#" className="flex items-center justify-center gap-2 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl">
                  <LogOut className="w-5 h-5" /> Déconnexion
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ============================================================
// PUBLIC HEADER (Responsive + Hamburger amélioré)
// ============================================================
const Header = ({ currentExplore, onNavigate }: { currentExplore: 'sell' | 'rent'; onNavigate: (key: 'sell' | 'rent') => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-cyan-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <span className="text-white font-bold text-lg sm:text-2xl tracking-tighter">I</span>
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl lg:text-3xl tracking-tight text-slate-900 leading-none">
                ImmoNet
              </h1>
              <p className="text-[9px] sm:text-[10px] text-cyan-600 font-medium hidden sm:block">
                Immobilier • Connecté
              </p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm font-medium">
            <button 
              onClick={() => onNavigate('sell')}
              className={`transition-colors duration-200 whitespace-nowrap ${
                currentExplore === 'sell'
                  ? 'text-cyan-600 font-semibold' 
                  : 'text-slate-700 hover:text-cyan-600'
              }`}
            >
              À Vendre
            </button>
            <button 
              onClick={() => onNavigate('rent')}
              className={`transition-colors duration-200 whitespace-nowrap ${
                currentExplore === 'rent'
                  ? 'text-cyan-600 font-semibold' 
                  : 'text-slate-700 hover:text-cyan-600'
              }`}
            >
              À Louer
            </button>
            <button className="text-slate-700 hover:text-cyan-600 transition-colors duration-200 whitespace-nowrap">
              Annonces
            </button>
            <button className="text-slate-700 hover:text-cyan-600 transition-colors duration-200 whitespace-nowrap">
              Propriétaires
            </button>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <button className="px-3 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm font-medium text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-all duration-200 whitespace-nowrap">
              Se connecter
            </button>
            <button className="flex items-center gap-2 px-4 xl:px-7 py-2 xl:py-3 bg-linear-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white text-xs xl:text-sm font-medium rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 hover:scale-[1.03] active:scale-95 whitespace-nowrap">
              <Plus className="w-4 h-4 xl:w-5 xl:h-5" />
              <span className="hidden lg:inline">Publier une annonce</span>
              <span className="lg:hidden">Publier</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-cyan-100 bg-white overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-1">
              {([
                { label: 'À Vendre', key: 'sell' },
                { label: 'À Louer', key: 'rent' },
              ] as Array<{ label: string; key: 'sell' | 'rent' }>).map((item, idx) => (
                <motion.button
                  key={item.key}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => { onNavigate(item.key); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-colors ${
                    currentExplore === item.key 
                      ? 'text-cyan-600 bg-cyan-50' 
                      : 'text-slate-700 hover:text-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.button 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="block w-full text-left px-3 py-3 text-base text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 font-medium rounded-xl"
              >
                Annonces
              </motion.button>
              <motion.button 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="block w-full text-left px-3 py-3 text-base text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 font-medium rounded-xl"
              >
                Propriétaires
              </motion.button>
              
              <div className="pt-4 mt-4 border-t border-cyan-100 space-y-3">
                <button className="flex items-center justify-center gap-2 w-full py-3.5 text-slate-700 font-medium text-base border border-cyan-200 rounded-xl hover:bg-cyan-50 transition-colors">
                  <User className="w-5 h-5" />
                  Mon compte
                </button>
                <button className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-medium text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Plus className="w-5 h-5" />
                  Publier une annonce
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ============================================================
// DEMO CONTENT
// ============================================================
const DemoContent = ({ variant }: { variant: 'public' | 'dashboard' }) => {
  const properties = [
    { title: "Villa Moderne Bastos", price: "85 000 000 FCFA", beds: 5, baths: 4, area: "420m²", loc: "Bastos, Yaoundé", img: "villa moderne africaine avec piscine et jardin tropical, architecture contemporaine, photo immobilière professionnelle" },
    { title: "Appartement Akwa Centre", price: "450 000 FCFA/mois", beds: 3, baths: 2, area: "140m²", loc: "Akwa, Douala", img: "appartement moderne lumineux avec vue sur ville africaine, salon contemporain, photo immobilière" },
    { title: "Maison Familiale Bonapriso", price: "120 000 000 FCFA", beds: 6, baths: 5, area: "550m²", loc: "Bonapriso, Douala", img: "grande maison familiale moderne avec jardin, Afrique, photo immobilière professionnelle" },
    { title: "Studio Meublé Centre", price: "180 000 FCFA/mois", beds: 1, baths: 1, area: "45m²", loc: "Centre-ville", img: "studio moderne meublé design contemporain, photo immobilière" },
  ];

  return (
    <div className="bg-linear-to-br from-slate-50 via-cyan-50/30 to-white min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-cyan-100 text-cyan-700 text-[10px] sm:text-xs font-semibold rounded-full mb-3 sm:mb-4">
            ✨ Plus de 2 500 biens disponibles
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Trouvez le bien <br />
            <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
              qui vous correspond
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 lg:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl">
            Explorez les meilleures offres immobilières au Cameroun. Achat, vente ou location — ImmoNet vous connecte aux propriétaires vérifiés.
          </p>

          {/* Search bar */}
          <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-xl shadow-cyan-500/5 p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Ville, quartier..." 
                className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-3 border-r border-slate-100">
              <Home className="w-5 h-5 text-cyan-500 shrink-0" />
              <select className="bg-transparent text-sm focus:outline-none text-slate-700">
                <option>Type de bien</option>
                <option>Villa</option>
                <option>Appartement</option>
                <option>Terrain</option>
              </select>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-400 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm sm:text-base">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Rechercher</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-6 max-w-xl">
            {[
              { val: "2.5K+", label: "Biens actifs" },
              { val: "850+", label: "Propriétaires" },
              { val: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{s.val}</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500 mt-0.5 sm:mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
        <div className="flex items-end justify-between mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-slate-900">Biens en vedette</h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-500 mt-1 sm:mt-2">
              {variant === 'dashboard' ? 'Vos annonces populaires' : 'Découvrez nos dernières opportunités'}
            </p>
          </div>
          <button className="text-xs sm:text-sm text-cyan-600 font-medium hover:underline whitespace-nowrap">
            Voir tout →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {properties.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 border border-slate-100"
            >
              <div className="relative h-40 sm:h-48 bg-linear-to-br from-cyan-100 to-cyan-200 overflow-hidden">
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(p.img)}?width=600&height=400&nologo=true`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <button className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-slate-600" />
                </button>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 sm:px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] sm:text-xs font-medium text-slate-700">
                  ⭐ Premium
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3" />
                  {p.loc}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-500">
                  <span>{p.beds} 🛏</span>
                  <span>•</span>
                  <span>{p.baths} 🚿</span>
                  <span>•</span>
                  <span>{p.area}</span>
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm lg:text-base text-cyan-600">{p.price}</span>
                  <button className="text-[10px] sm:text-xs text-slate-600 hover:text-cyan-600 font-medium">Détails →</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-cyan-100 bg-white mt-10 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500">
          © 2026 ImmoNet • Plateforme immobilière au Cameroun
        </div>
      </footer>
    </div>
  );
};

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function Appp() {
  const [variant, setVariant] = useState<'public' | 'dashboard'>('public');
  const [explore, setExplore] = useState<'sell' | 'rent'>('sell');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sélecteur de variante (bandeau demo) */}
      <div className="bg-slate-900 text-white text-center text-xs sm:text-sm py-2 px-4 sticky top-0 z-60">
        <span className="opacity-70 mr-2 sm:mr-4">Démo :</span>
        <button 
          onClick={() => setVariant('public')}
          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${variant === 'public' ? 'bg-cyan-500 text-white' : 'opacity-70 hover:opacity-100'}`}
        >
          Page publique
        </button>
        <button 
          onClick={() => setVariant('dashboard')}
          className={`ml-1 sm:ml-2 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${variant === 'dashboard' ? 'bg-cyan-500 text-white' : 'opacity-70 hover:opacity-100'}`}
        >
          Dashboard
        </button>
        <span className="hidden sm:inline opacity-50 ml-4">• Redimensionnez la fenêtre pour voir le responsive</span>
      </div>

      {variant === 'public' ? (
        <Header currentExplore={explore} onNavigate={setExplore} />
      ) : (
        <DashboardHeader />
      )}

      <DemoContent variant={variant} />
    </div>
  );
}
