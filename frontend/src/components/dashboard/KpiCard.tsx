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
    <div className="bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-cyan-50 rounded-xl">
          <Icon className="w-5 h-5 text-cyan-600" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-600">{title}</p>
        <p className="text-2xl font-display font-bold text-slate-900 mt-1 tabular-nums">
          {value} {unit && <span className="text-lg font-normal">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;