import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from './Dashboard';
import MessageAlert from '@/components/ui/MessageAlert';
import dashboardMockData from '@/lib/data/mockData.json';

interface DashboardPageProps {
  notificationCount?: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  notificationCount = 3,
}) => {
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;
  const [data, setData] = useState(dashboardMockData);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation d'un appel API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: Remplacer par un vrai appel API (GET /api/biens/stats/me)
        setData(dashboardMockData);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout notificationCount={notificationCount}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout notificationCount={notificationCount}>
      {locationState?.message && (
        <div className="mb-6">
          <MessageAlert type="success" message={locationState.message} />
        </div>
      )}
      <Dashboard data={data} />
    </DashboardLayout>
  );
};

export default DashboardPage;
