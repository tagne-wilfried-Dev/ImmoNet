import React, { useState } from 'react';
import HeaderConnected from './HeaderConnected';
import Sidebar from '../dashboard/SidebarU';
import NotificationModal from './NotificationModale';
import { useAppSelector } from '@/store/hooks';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: 'CLIENT' | 'PRO' | 'ADMIN';
  notificationCount?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName: propsUserName,
  userRole: propsUserRole,
  notificationCount = 0,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // Desktop : sidebar collapsed/expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Mobile : drawer ouvert/fermé — état distinct car comportement différent
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Détermination dynamique des infos utilisateur
  const userName = propsUserName || user?.nom || 'Utilisateur';
  
  // Si on est dans une route /admin, on force l'affichage ADMIN de la sidebar
  // même si l'utilisateur a d'autres droits, pour éviter le basculement visuel
  const isAdminPath = location.pathname.startsWith('/admin');
  const userRole = isAdminPath ? 'ADMIN' : (propsUserRole || (user?.role as any) || 'CLIENT');

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderConnected
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        onToggleSidebar={() => setIsMobileOpen((prev) => !prev)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
      />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        userRole={userRole}
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Sur mobile : pas de margin-left (sidebar est un drawer par-dessus le contenu) */}
      {/* Sur desktop : margin-left selon état collapsed */}
      <main
        className={`
          transition-all duration-300 ease-out pt-4 pb-12
          lg:ml-64
          ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        <div className="px-4 lg:px-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
