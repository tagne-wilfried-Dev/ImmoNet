import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import type { PropertySummary } from '@/lib/types/property.types';
import {
  aggregateByStatut,
  aggregateByType,
  computeQuota,
} from '@/lib/stats/proprietaireStats';

interface DashboardChartsProps {
  biens: PropertySummary[];
  plan?: string;
}

// Palette Aqua Tech (cyan / slate)
const STATUT_COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#0e7490', '#64748b', '#94a3b8', '#cbd5e1'];

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  fontSize: '12px',
  padding: '8px 12px',
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900 mb-4">{title}</h2>
    <div className="h-64">{children}</div>
  </div>
);

const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-full text-sm text-slate-400">
    {message ?? 'Aucune donnée à afficher'}
  </div>
);

const DashboardCharts: React.FC<DashboardChartsProps> = ({ biens, plan }) => {
  const statutData = aggregateByStatut(biens);
  const typeData = aggregateByType(biens);
  const quota = computeQuota(biens, plan);

  const quotaData = [
    {
      name: 'Quota',
      value: quota.quota > 0 ? Math.round((quota.publies / quota.quota) * 100) : 0,
      fill: '#0891b2',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Donut — Répartition par statut */}
      <ChartCard title="Patrimoine par statut">
        {statutData.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {statutData.map((entry, index) => (
                  <Cell key={entry.key} fill={STATUT_COLORS[index % STATUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* BarChart — Répartition par type de bien */}
      <ChartCard title="Composition par type de bien">
        {typeData.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f0f9ff' }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Biens" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* RadialBar — Quota d'abonnement */}
      <ChartCard title={`Quota d'annonces (${quota.plan})`}>
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={18}
              data={quotaData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar background dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-display font-bold text-slate-900">
              {quota.publies}
              <span className="text-lg text-slate-400">/{quota.quota}</span>
            </span>
            <span className="text-xs text-slate-500 mt-1">
              {quota.restant} restante{quota.restant > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default DashboardCharts;
