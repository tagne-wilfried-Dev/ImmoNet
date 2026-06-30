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
  Tag,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
// import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole: 'CLIENT' | 'PRO' | 'ADMIN';
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
  { icon: Building2, label: 'Mes biens', path: '/dashboard/biens' },
  { icon: CalendarDays, label: 'Réservations', path: '/dashboard/reservations' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: CheckCircle, label: 'Validations', path: '/dashboard/validations' },
  { icon: Grid3X3, label: 'Équipements', path: '/dashboard/equipements' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 shadow-sm transition-colors z-50"
        aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1 p-3 pt-4" aria-label="Navigation dashboard">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-50 text-cyan-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon
                size={20}
                className={`shrink-0 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'}`}
              />

              {/* Label - visible seulement si non collapsed, ou au survol si collapsed */}
              <span
                className={`whitespace-nowrap text-sm transition-all duration-200 ${
                  isCollapsed
                    ? 'absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-lg'
                    : 'opacity-100'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Info */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-xl p-3 border border-cyan-200">
            <p className="text-xs font-semibold text-cyan-800">Compte {userRole}</p>
            <p className="text-[10px] text-cyan-600 mt-0.5">ImmoNet Pro</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;