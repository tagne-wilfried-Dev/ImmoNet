import React, { useState } from 'react';
import HeaderConnected from './HeaderConnected';
import Sidebar from '../dashboard/SidebarU';
import NotificationModal from './NotificationModale';
// import { Notification } from './NotificationModale'; // réutilise le type

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: 'CLIENT' | 'PRO' | 'ADMIN';
  notificationCount?: number;
  notifications?: Notification[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName = 'Utilisateur',
  userRole = 'PRO',
  notificationCount = 0,
  // notifications = [],
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openNotifModal = () => setIsNotifModalOpen(true);
  const closeNotifModal = () => setIsNotifModalOpen(false);

  // Mock handlers (à remplacer par Redux/API plus tard)
  // const handleMarkAllRead = () => console.log('Tout marqué comme lu');
  // const handleDeleteNotif = (id: number) => console.log('Supprimé:', id);

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderConnected
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        onToggleSidebar={toggleSidebar}
        onOpenNotifications={openNotifModal}
      />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        userRole={userRole}
      />

      <main
        className={`transition-all duration-300 ease-out pt-4 pb-8 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="px-4 lg:px-6 max-w-7xl mx-auto">{children}</div>
      </main>

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={closeNotifModal}
        // notifications={notifications}
        // onMarkAllRead={handleMarkAllRead}
        // onDelete={handleDeleteNotif}
      />
    </div>
  );
};

export default DashboardLayout;