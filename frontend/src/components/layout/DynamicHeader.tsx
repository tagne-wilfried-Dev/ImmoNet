import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Header from './Header';
import HeaderConnected from './HeaderConnected';

interface DynamicHeaderProps {
  currentExplore?: 'rent' | 'sell';
  onNavigate?: (type: 'rent' | 'sell') => void;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ 
  currentExplore = 'sell', 
  onNavigate = () => {} 
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const userDisplayName = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
    return (
      <HeaderConnected
        userName={userDisplayName}
        userRole={user.role as any || 'CLIENT'}
        notificationCount={0} // À lier au store plus tard si besoin
        onToggleSidebar={() => {}} // Pas de sidebar sur les pages publiques
        onOpenNotifications={() => {}} // À implémenter si besoin
      />
    );
  }

  return <Header currentExplore={currentExplore} onNavigate={onNavigate} />;
};

export default DynamicHeader;
