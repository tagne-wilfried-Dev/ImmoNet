import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  MessageSquare,
  Wallet,
  Bell,
  CheckCircle,
  Grid3X3,
  Heart,
  Search,
  KeyRound,
  ShieldCheck,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Megaphone,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleBadge from '../ui/RoleBadge';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'CLIENT' | 'PRO' | 'ADMIN';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];
  badge?: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole: UserRole;
  onClose?: () => void;
  isMobileOpen?: boolean;
  /** Mode drawer uniquement (pages publiques) : pas de sidebar fixe desktop,
   *  le panneau coulissant fonctionne à toutes les tailles d'écran. */
  drawerOnly?: boolean;
}

// Items à grouper pour l'ADMIN
const PRO_GROUP_PATHS = [
  '/dashboard/biens',
  '/dashboard/annonces',
  '/dashboard/equipements',
  '/dashboard/validations'
];

// ─── Items de navigation — filtrés par rôle au rendu ─────────────────────────

const MENU_ITEMS: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Tableau de bord',
    path: '/dashboard',
    roles: ['CLIENT', 'PRO', 'ADMIN'],
  },
  {
    icon: Search,
    label: 'Explorer',
    path: '/explore/louer',
    roles: ['CLIENT'],
  },
  {
    icon: Heart,
    label: 'Mes favoris',
    path: '/dashboard/favoris',
    roles: ['CLIENT'],
  },
  {
    icon: KeyRound,
    label: 'Mes locations',
    path: '/dashboard/locations',
    roles: ['CLIENT'],
  },
  {
    icon: Building2,
    label: 'Mes biens',
    path: '/dashboard/biens',
    roles: ['PRO', 'ADMIN'],
  },
  {
    icon: Megaphone,
    label: 'Mes annonces',
    path: '/dashboard/annonces',
    roles: ['PRO', 'ADMIN'],
  },
  {
    icon: Grid3X3,
    label: 'Équipements',
    path: '/dashboard/equipements',
    roles: ['PRO', 'ADMIN'],
  },
  {
    icon: CheckCircle,
    label: 'Validations',
    path: '/dashboard/validations',
    roles: ['PRO', 'ADMIN'],
  },
  {
    icon: CalendarDays,
    label: 'Réservations',
    path: '/dashboard/reservations',
    roles: ['CLIENT', 'PRO', 'ADMIN'],
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: '/dashboard/messages',
    roles: ['CLIENT', 'PRO', 'ADMIN'],
  },
  {
    icon: Bell,
    label: 'Notifications',
    path: '/dashboard/notifications',
    roles: ['CLIENT', 'PRO', 'ADMIN'],
  },
  // ADMIN uniquement
  {
    icon: ShieldCheck,
    label: 'Modération',
    path: '/admin/moderation',
    roles: ['ADMIN'],
  },
  {
    icon: Users,
    label: 'Utilisateurs',
    path: '/admin/utilisateurs',
    roles: ['ADMIN'],
  },
  {
    icon: BarChart3,
    label: 'Statistiques',
    path: '/admin/statistiques',
    roles: ['ADMIN'],
  },
  {
    icon: Settings,
    label: 'Configuration',
    path: '/admin/configuration',
    roles: ['ADMIN'],
  },
];

// ─── NavItem partagé ────────────────────────────────────────────────────────

interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, isCollapsed, onClick, isSubItem = false }) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left
      transition-all duration-150 group
      ${isActive
        ? 'bg-cyan-50 text-cyan-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }
      ${isSubItem ? 'pl-11 py-2' : ''}
    `}
    aria-current={isActive ? 'page' : undefined}
  >
    {isActive && !isSubItem && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-cyan-500 rounded-r-full" />
    )}
    
    {isActive && isSubItem && (
      <span className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-500 rounded-full" />
    )}

    {!isSubItem && (
      <item.icon
        size={19}
        className={`shrink-0 transition-colors ${
          isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'
        }`}
        aria-hidden="true"
      />
    )}

    {!isCollapsed && (
      <span className={cn(
        "text-sm font-medium flex-1 truncate",
        isSubItem ? "text-[13px]" : ""
      )}>
        {item.label}
      </span>
    )}

    {!isCollapsed && item.badge != null && item.badge > 0 && (
      <span className="ml-auto text-[10px] font-bold bg-cyan-100 text-cyan-700 rounded-full px-1.5 py-0.5 leading-none">
        {item.badge}
      </span>
    )}

    {/* Tooltip quand collapsed */}
    {isCollapsed && (
      <span
        className="
          absolute left-full ml-3 px-2.5 py-1.5
          bg-slate-800 text-white text-xs font-medium rounded-lg
          opacity-0 group-hover:opacity-100 pointer-events-none
          whitespace-nowrap z-50 shadow-lg transition-opacity duration-150
        "
        role="tooltip"
      >
        {item.label}
      </span>
    )}
  </button>
);

// ─── Composant principal ──────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  userRole,
  onClose,
  isMobileOpen = false,
  drawerOnly = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProGroupOpen, setIsProGroupOpen] = React.useState(() => 
    PRO_GROUP_PATHS.some(path => location.pathname.startsWith(path))
  );

  const visibleItems = MENU_ITEMS.filter((item) => item.roles.includes(userRole));

  const isItemActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const isAnyProItemActive = PRO_GROUP_PATHS.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* ── Desktop : sidebar fixe, collapsible (masquée en mode drawer) ──── */}
      {!drawerOnly && (
      <div
        className={`
          hidden lg:block fixed left-0 top-16 bottom-0 z-40
          bg-white border-r border-slate-200
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Bouton collapse */}
        <button
          onClick={onToggle}
          className="
            absolute -right-3 top-5 w-6 h-6
            bg-white border border-slate-200 rounded-full
            flex items-center justify-center
            text-slate-400 hover:text-cyan-700 hover:border-cyan-300
            shadow-sm transition-colors z-50
          "
          aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        <nav
          className="flex flex-col gap-0.5 p-3 pt-5 h-full overflow-y-auto pb-36"
          aria-label="Navigation dashboard"
        >
          {visibleItems.map((item, _index) => {
            const isProItem = PRO_GROUP_PATHS.includes(item.path);
            const isAdmin = userRole === 'ADMIN';

            // Si c'est un item Pro et qu'on est ADMIN, on gère le groupement
            if (isAdmin && isProItem) {
              // On n'affiche le header du groupe qu'au premier item rencontré
              const isFirstProItem = item.path === PRO_GROUP_PATHS[0];
              if (!isFirstProItem) return null;

              return (
                <div key="pro-group" className="space-y-0.5">
                  <button
                    onClick={() => !isCollapsed && setIsProGroupOpen(!isProGroupOpen)}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left
                      transition-all duration-150 group
                      ${isAnyProItemActive && !isProGroupOpen 
                        ? 'bg-cyan-50/50 text-cyan-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <Building2
                      size={19}
                      className={`shrink-0 transition-colors ${
                        isAnyProItemActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-semibold flex-1 truncate">Espace Propriétaire</span>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-200 ${isProGroupOpen ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        Espace Propriétaire
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isProGroupOpen && !isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-0.5"
                      >
                        {visibleItems.filter(i => PRO_GROUP_PATHS.includes(i.path)).map(subItem => (
                          <NavItem
                            key={subItem.path}
                            item={subItem}
                            isActive={isItemActive(subItem.path)}
                            isCollapsed={isCollapsed}
                            onClick={() => handleNavigate(subItem.path)}
                            isSubItem
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavItem
                key={item.path}
                item={item}
                isActive={isItemActive(item.path)}
                isCollapsed={isCollapsed}
                onClick={() => handleNavigate(item.path)}
              />
            );
          })}
        </nav>

        {!isCollapsed && <RoleBadge userRole={userRole} />}
      </div>
      )}

      {/* ── Drawer coulissant : mobile partout, + desktop en mode drawerOnly ── */}

      {/* Overlay */}
      <div
        className={`
          ${drawerOnly ? '' : 'lg:hidden'} fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          ${drawerOnly ? '' : 'lg:hidden'} fixed left-0 top-0 bottom-0 z-50 w-72
          bg-white border-r border-slate-200 flex flex-col
          transition-transform duration-300 ease-out shadow-xl
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-cyan-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span
              className="font-bold text-slate-900 text-base"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Immo<span className="text-cyan-600">Net</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav mobile — labels toujours visibles */}
        <nav
          className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto"
          aria-label="Navigation dashboard mobile"
        >
          {visibleItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={isItemActive(item.path)}
              isCollapsed={false} // toujours déplié sur mobile
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </nav>

        <RoleBadge userRole={userRole} />
      </div>
    </>
  );
};

export default Sidebar;
