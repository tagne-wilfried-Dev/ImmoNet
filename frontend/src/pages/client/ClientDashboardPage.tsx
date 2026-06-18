import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  CalendarCheck,
  KeyRound,
  MessageSquare,
  Search,
  CalendarDays,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  Bookmark,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KpiCard from '@/components/dashboard/KpiCard';
import ActionCard from '@/components/dashboard/ActionCard';
import MessageAlert from '@/components/ui/MessageAlert';
import clientMockData from '@/lib/data/mockDataClient.json';
import type { LucideIcon } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

// ─── Types locaux alignés sur mockDataClient.json ─────────────────────────────

interface KpiData {
  id: string;
  title: string;
  value: string;
  trend: string;
  positive: boolean;
  icon: string;
}

interface ActivityItem {
  id: number;
  type: string;
  label: string;
  detail: string;
  date: string;
  status: 'success' | 'pending' | 'info' | 'neutral';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  count?: number;
}

interface SavedSearch {
  id: number;
  label: string;
  criteria: string;
  newResults: number;
}

interface ClientDashboardData {
  kpis: KpiData[];
  recentActivity: ActivityItem[];
  quickActions: QuickAction[];
  savedSearches: SavedSearch[];
}

// ─── Map icon string → composant Lucide ──────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  CalendarCheck,
  KeyRound,
  MessageSquare,
  Search,
  CalendarDays,
  Bell,
  Bookmark,
  TrendingUp,
  MapPin,
};

const resolveIcon = (name: string): LucideIcon => ICON_MAP[name] ?? Bell;

// ─── Sous-composants ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  pending: {
    icon: Clock,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: Info,
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  neutral: {
    icon: Bookmark,
    bg: 'bg-slate-100',
    iconColor: 'text-slate-500',
  },
} as const;

interface ActivityRowProps {
  item: ActivityItem;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ item }) => {
  const config = STATUS_CONFIG[item.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
        <StatusIcon size={15} className={config.iconColor} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 leading-tight">{item.label}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{item.detail}</p>
      </div>
      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
        {item.date}
      </span>
    </div>
  );
};

interface SavedSearchCardProps {
  search: SavedSearch;
  onNavigate: (path: string) => void;
}

const SavedSearchCard: React.FC<SavedSearchCardProps> = ({ search, onNavigate }) => (
  <button
    onClick={() => onNavigate('/explorer')}
    className="w-full flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/40 transition-all duration-150 text-left group"
  >
    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
      <Search size={14} className="text-cyan-600" aria-hidden="true" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-800 truncate">{search.label}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{search.criteria}</p>
    </div>
    {search.newResults > 0 && (
      <span className="shrink-0 text-[10px] font-bold bg-cyan-100 text-cyan-700 rounded-full px-2 py-0.5 leading-none">
        +{search.newResults}
      </span>
    )}
    <ChevronRight
      size={14}
      className="text-slate-300 group-hover:text-cyan-500 transition-colors shrink-0"
      aria-hidden="true"
    />
  </button>
);

// ─── Page principale ──────────────────────────────────────────────────────────

interface ClientDashboardPageProps {
  userName?: string;
  userRole?: 'CLIENT' | 'PRO' | 'ADMIN';
  notificationCount?: number;
}

const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({
  userName = 'Utilisateur',
  userRole = 'CLIENT',
  notificationCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: remplacer par appel API réel — GET /api/dashboard/client
    const load = async () => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 300));
        setData(clientMockData as ClientDashboardData);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const { user } = useAppSelector((state) => state.auth);
  const displayFirstName = (userName || user?.prenom || 'Utilisateur').split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  if (isLoading) {
    return (
      <DashboardLayout
        userName={userName}
        userRole={userRole}
        notificationCount={notificationCount}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Chargement de votre espace…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      notificationCount={notificationCount}
    >
      <div className="space-y-6">

        {/* ── Alerte post-login ──────────────────────────────────────────── */}
        {locationState?.message && (
          <MessageAlert type="success" message={locationState.message} />
        )}

        {/* ── En-tête ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {greeting}, {displayFirstName} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Voici un aperçu de votre activité sur ImmoNet.
            </p>
          </div>

          <button
            onClick={() => navigate('/explorer')}
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 text-white text-sm font-semibold rounded-full shadow-[0_4px_14px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={15} aria-hidden="true" />
            Explorer les biens
          </button>
        </div>

        {/* ── KPIs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              icon={resolveIcon(kpi.icon)}
              title={kpi.title}
              value={kpi.value}
            />
          ))}
        </div>

        {/* ── Activité récente + Recherches sauvegardées ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Activité récente — 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-900 text-base">Activité récente</h2>
              <button
                onClick={() => navigate('/dashboard/notifications')}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 transition-colors"
              >
                Tout voir <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Vos dernières interactions sur la plateforme</p>
            <div>
              {data.recentActivity.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Recherches sauvegardées — 1/3 */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-slate-900 text-base">Mes recherches</h2>
              <button
                onClick={() => navigate('/explorer')}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 transition-colors"
              >
                Explorer <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Alertes activées sur ces critères</p>

            {data.savedSearches.length > 0 ? (
              <div className="space-y-2.5">
                {data.savedSearches.map((s) => (
                  <SavedSearchCard key={s.id} search={s} onNavigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <Search size={18} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Aucune recherche sauvegardée</p>
                <button
                  onClick={() => navigate('/explorer')}
                  className="mt-3 text-xs text-cyan-600 font-medium hover:underline"
                >
                  Lancer une recherche
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions rapides ───────────────────────────────────────────── */}
        <div>
          <h2 className="font-semibold text-slate-900 text-base mb-1">Actions rapides</h2>
          <p className="text-xs text-slate-400 mb-4">Accédez directement à vos espaces clés</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.quickActions.map((action) => (
              <ActionCard
                key={action.id}
                icon={resolveIcon(action.icon)}
                title={action.title}
                description={action.description}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </div>

        {/* ── Bannière upgrade PRO ──────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Halos décoratifs */}
          <div className="absolute top-0 right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest mb-1.5">
              Passez au niveau supérieur
            </p>
            <h3
              className="text-lg font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Devenez Propriétaire Pro
            </h3>
            <p className="text-sm text-slate-400 mt-1.5 max-w-sm leading-relaxed">
              Publiez vos annonces, gérez vos locataires et boostez votre visibilité sur ImmoNet.
            </p>
          </div>

          <button
            onClick={() => navigate('/devenir-pro')}
            className="relative shrink-0 flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold text-sm rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_14px_rgba(6,182,212,0.35)]"
          >
            Découvrir les offres
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;