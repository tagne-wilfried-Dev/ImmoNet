import React, { useState } from 'react';
import HeaderConnected from './HeaderConnected';
import Sidebar from '../dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: 'CLIENT' | 'PRO' | 'ADMIN';
  notificationCount?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName = 'Utilisateur',
  userRole = 'PRO',
  notificationCount = 0,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderConnected
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
        onToggleSidebar={toggleSidebar}
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
        <div className="px-4 lg:px-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;