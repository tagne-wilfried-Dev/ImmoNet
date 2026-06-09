import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  unit?: string;
  trend?: string;
  trendLabel?: string;
  positive?: boolean;
  /** Affiche un anneau d'alerte rouge — pour les items urgents (ex: validations en attente) */
  urgent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  unit,
  trend,
  trendLabel,
  positive = true,
  urgent = false,
}) => {
  return (
    <Card variant="statistic" className={urgent ? 'border-l-red-500' : 'border-l-cyan-500'}>
      <div className="flex items-start justify-between">
        {/* Icône */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            urgent ? 'bg-red-50' : 'bg-cyan-50'
          }`}
        >
          {urgent ? (
            <AlertCircle size={19} className="text-red-500" aria-hidden="true" />
          ) : (
            <Icon size={19} className="text-cyan-600" aria-hidden="true" />
          )}
        </div>

        {/* Badge tendance */}
        {trend && (
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              urgent
                ? 'bg-red-50 text-red-600'
                : positive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {urgent ? (
              <AlertCircle size={10} aria-hidden="true" />
            ) : positive ? (
              <TrendingUp size={10} aria-hidden="true" />
            ) : (
              <TrendingDown size={10} aria-hidden="true" />
            )}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="mt-1 font-bold text-slate-900 leading-none" style={{ fontSize: '1.75rem', fontFamily: "'Syne', sans-serif" }}>
          {value}
          {unit && (
            <span className="text-sm font-normal text-slate-500 ml-1.5">{unit}</span>
          )}
        </p>
        {trendLabel && (
          <p className="mt-1.5 text-[11px] text-slate-400">{trendLabel}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
