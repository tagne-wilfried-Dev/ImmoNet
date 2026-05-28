import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  unit?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, title, value, unit }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-cyan-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-cyan-50 rounded-2xl">
          <Icon className="w-6 h-6 text-cyan-600" />
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm text-slate-600">{title}</p>
        <p className="text-3xl font-display font-bold text-slate-900 mt-1">
          {value} {unit && <span className="text-xl font-normal">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;