import React from 'react';
import {
  Eye,
  TrendingUp,
  Wallet,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Home,
} from 'lucide-react';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import type { PropertySummary } from '@/lib/types/property.types';

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<{ size: number; className: string }>> = {
  Eye,
  TrendingUp,
  Wallet,
  MapPin,
  Calendar,
  MessageSquare,
  Home,
};

interface DashboardData {
  kpis: Array<{
    id: string;
    title: string;
    value: string;
    previousValue?: string;
    trend?: string;
    positive?: boolean;
    icon: string;
  }>;
  quickActions: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
    count: number;
  }>;
}

interface DashboardProps {
  data: DashboardData;
  biens: PropertySummary[];
  plan?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, biens, plan }) => {
  const { kpis, quickActions } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">
          Tableau de bord
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Bienvenue sur votre espace propriétaire
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {kpis.map((kpi) => {
          const IconComponent = iconMap[kpi.icon] || Eye;
          return (
            <div
              key={kpi.id}
              className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-display font-bold text-slate-900 mt-1">
                      {kpi.value}
                    </p>
                  </div>
                </div>
                {kpi.trend && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      kpi.positive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {kpi.positive ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {kpi.trend}
                  </div>
                )}
              </div>
              {kpi.previousValue && (
                <p className="text-xs text-slate-500 mt-3">
                  vs {kpi.previousValue} hier
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <DashboardCharts biens={biens} plan={plan} />

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {quickActions.map((action) => {
          const IconComponent = iconMap[action.icon] || MapPin;
          return (
            <button
              key={action.id}
              onClick={() => (window.location.href = action.path)}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-cyan-600 group-hover:to-cyan-500 transition-all duration-200">
                  <IconComponent size={24} className="text-white" />
                </div>
                {action.count > 0 && (
                  <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {action.count}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
