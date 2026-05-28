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
} from 'lucide-react';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';


// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, React.ComponentType<{ size: number; className: string }>> = {
  Eye,
  TrendingUp,
  Wallet,
  MapPin,
  Calendar,
  MessageSquare,
};

interface DashboardData {
  kpis: Array<{
    id: string;
    title: string;
    value: string;
    previousValue: string;
    trend: string;
    positive: boolean;
    icon: string;
  }>;
  // chartData: Array<{
  //   date: string;
  //   vues: number;
  //   clics: number;
  // }>;
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
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // const { kpis, chartData, quickActions } = data;
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
              </div>
              <p className="text-xs text-slate-500 mt-3">
                vs {kpi.previousValue} hier
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      {/* <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-slate-900">
            Progression de vos annonces (nombre de vues)
          </h2>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>Cette année</option>
          </select>
        </div>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ fontWeight: 600, color: '#0f172a' }}
              />
              <Area
                type="monotone"
                dataKey="vues"
                stroke="#0891b2"
                strokeWidth={3}
                fill="url(#colorVues)"
                dot={{
                  fill: '#0891b2',
                  strokeWidth: 2,
                  r: 4,
                  stroke: '#ffffff',
                }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}

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