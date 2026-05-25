import React from 'react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import KpiCard from '@/components/dashboard/KpiCard';
import ActionCard from '@/components/dashboard/ActionCard';
import { Eye, TrendingUp, CreditCard, MapPin, Plus, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 lg:ml-72">
        {/* Header de dashboard */}
        <div className="bg-white border-b border-cyan-100 px-8 py-6">
          <h1 className="font-display text-3xl font-bold text-slate-900">Tableau de bord</h1>
        </div>

        <div className="p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <KpiCard icon={Eye} title="Nombre de vues aujourd'hui" value="0" />
            <KpiCard icon={TrendingUp} title="Mes ventes d'aujourd'hui" value="0.00" unit="CFA" />
            <KpiCard icon={CreditCard} title="Sur votre compte" value="0.00" unit="CFA" />
          </div>

          {/* Progression */}
          <div className="bg-white rounded-3xl p-8 mb-10 border border-cyan-100">
            <h2 className="font-semibold text-xl mb-6">Progression de vos annonces (nombre de vues)</h2>
            {/* Pour l'instant un placeholder - on pourra mettre Recharts plus tard */}
            <div className="h-64 flex items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              Graphique de progression (à implémenter avec Recharts)
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              icon={MapPin} 
              title="Mes annonces" 
              description="Gérer vos annonces, modifier votre planning, promotions etc..." 
            />
            <ActionCard 
              icon={Plus} 
              title="Mes réservations" 
              description="Gérer, annuler vos réservations" 
            />
            <ActionCard 
              icon={MessageSquare} 
              title="Mes messages" 
              description="Suivez toutes vos conversations importantes" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;