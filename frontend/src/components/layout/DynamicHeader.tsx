import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import Header from './Header';
import HeaderConnected from './HeaderConnected';
import Sidebar from '../dashboard/SidebarU';

interface DynamicHeaderProps {
  currentExplore?: 'rent' | 'sell';
  onNavigate?: (type: 'rent' | 'sell') => void;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  currentExplore = 'sell',
  onNavigate = () => {}
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  // Drawer de la sidebar sur les pages publiques (accueil, recherche, fiche bien…)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isAuthenticated && user) {
    const userDisplayName = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
    const userRole = (user.role as 'CLIENT' | 'PRO' | 'ADMIN') || 'CLIENT';
    return (
      <>
        <HeaderConnected
          userName={userDisplayName}
          userRole={userRole}
          notificationCount={0} // À lier au store plus tard si besoin
          onToggleSidebar={() => setIsDrawerOpen((prev) => !prev)}
          onOpenNotifications={() => {}} // À implémenter si besoin
          alwaysShowMenu
        />

        {/* Sidebar accessible partout via un panneau coulissant */}
        <Sidebar
          drawerOnly
          isCollapsed={false}
          onToggle={() => {}}
          userRole={userRole}
          isMobileOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </>
    );
  }

  return <Header currentExplore={currentExplore} onNavigate={onNavigate} />;
};

export default DynamicHeader;
