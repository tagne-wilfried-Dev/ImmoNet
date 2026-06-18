import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from './Dashboard';
import MessageAlert from '@/components/ui/MessageAlert';
import { propertyService } from '@/services/PropertyService';
import { useAppSelector } from '@/store/hooks';
import type { PropertySummary } from '@/lib/types/property.types';
import { computeQuota, totalVues } from '@/lib/stats/proprietaireStats';
import dashboardMockData from '@/lib/data/mockData.json';

interface DashboardPageProps {
  notificationCount?: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  notificationCount = 3,
}) => {
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;
  const plan = useAppSelector((state) => state.auth.user?.abonnement?.typeAbonnement);

  const [biens, setBiens] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await propertyService.getMyProperties(0, 50);
        setBiens(response.data);
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

  const quota = computeQuota(biens, plan);
  const vues = totalVues(biens);

  // KPIs dérivés des vraies données du patrimoine
  const kpis = [
    {
      id: 'biens',
      title: 'Biens au patrimoine',
      value: String(biens.length),
      icon: 'Home',
    },
    {
      id: 'annonces',
      title: 'Annonces en ligne',
      value: `${quota.publies} / ${quota.quota}`,
      icon: 'MapPin',
    },
    {
      id: 'vues',
      title: 'Vues cumulées',
      value: String(vues),
      icon: 'Eye',
    },
  ];

  const data = {
    kpis,
    quickActions: dashboardMockData.quickActions,
  };

  return (
    <DashboardLayout notificationCount={notificationCount}>
      {locationState?.message && (
        <div className="mb-6">
          <MessageAlert type="success" message={locationState.message} />
        </div>
      )}
      <Dashboard data={data} biens={biens} plan={plan} />
    </DashboardLayout>
  );
};

export default DashboardPage;
