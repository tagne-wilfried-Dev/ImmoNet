import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Flag,
  UserCheck,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import type { Column } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import MessageAlert from '@/components/ui/MessageAlert';
import adminMockData from '@/lib/data/mockDataAdmin.json';
import type {
  ModerationItem,
  ModerationItemType,
  // ModerationStatus,
  UserRole,
  UserStatus,
  RecentUser,
  // KpiData,
  AdminDashboardData,
  // PlatformStats,
} from '@/lib/types/admin.types';



// ─── Map icon string → Lucide ─────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Building2,
  TrendingUp,
  Clock,
  ShieldCheck,
  BarChart3,
};
const resolveIcon = (name: string): LucideIcon => ICON_MAP[name] ?? BarChart3;

// ─── Configs badge ────────────────────────────────────────────────────────────

const USER_STATUS_BADGE: Record<UserStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  ACTIVE: { label: 'Actif', variant: 'success' },
  PENDING_VERIFICATION: { label: 'En attente', variant: 'warning' },
  SUSPENDED: { label: 'Suspendu', variant: 'error' },
  BANNED: { label: 'Banni', variant: 'error' },
};

const USER_ROLE_BADGE: Record<UserRole, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'error' }> = {
  CLIENT: { label: 'Client', variant: 'default' },
  PRO: { label: 'Pro', variant: 'info' },
  ADMIN: { label: 'Admin', variant: 'warning' },
};

const MODERATION_TYPE_CONFIG: Record<ModerationItemType, { label: string; icon: LucideIcon; color: string }> = {
  annonce: { label: 'Annonce', icon: Building2, color: 'text-cyan-600 bg-cyan-50' },
  pro_request: { label: 'Demande Pro', icon: UserCheck, color: 'text-violet-600 bg-violet-50' },
  signalement: { label: 'Signalement', icon: Flag, color: 'text-red-500 bg-red-50' },
};

// ─── Sous-composants ──────────────────────────────────────────────────────────

/** Ligne de statistique plateforme simple (label + valeur) */
interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}
const StatRow: React.FC<StatRowProps> = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-red-500' : 'text-slate-800'}`}>
      {value}
    </span>
  </div>
);

/** Barre de progression pour les abonnements */
interface SubscriptionBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}
const SubscriptionBar: React.FC<SubscriptionBarProps> = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="text-slate-700 font-semibold">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

// ─── Colonnes DataTable — Modération ─────────────────────────────────────────

const getModerationColumns = (
  onApprove: (id: number) => void,
  onReject: (id: number) => void,
  onView: (id: number) => void,
): Column<ModerationItem>[] => [
  {
    key: 'type',
    header: 'Type',
    width: 'w-32',
    render: (row) => {
      const config = MODERATION_TYPE_CONFIG[row.type];
      const TypeIcon = config.icon;
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
          <TypeIcon size={12} aria-hidden="true" />
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'title',
    header: 'Élément',
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-slate-800 leading-tight">{row.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">Par {row.submittedBy}</p>
      </div>
    ),
  },
  {
    key: 'submittedAt',
    header: 'Soumis',
    width: 'w-28',
    render: (row) => (
      <span className="text-xs text-slate-400 whitespace-nowrap">{row.submittedAt}</span>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    width: 'w-24',
    render: (row) => (
      <Badge variant={row.status === 'flagged' ? 'error' : 'warning'} size="sm">
        {row.status === 'flagged' ? 'Signalé' : 'En attente'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    width: 'w-32',
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onView(row.id); }}
          className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
          aria-label="Voir le détail"
          title="Voir"
        >
          <Eye size={15} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onApprove(row.id); }}
          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          aria-label="Approuver"
          title="Approuver"
        >
          <CheckCircle2 size={15} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onReject(row.id); }}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Rejeter"
          title="Rejeter"
        >
          <XCircle size={15} />
        </button>
      </div>
    ),
  },
];

// ─── Colonnes DataTable — Utilisateurs récents ────────────────────────────────

const getUserColumns = (
  onViewUser: (id: number) => void,
): Column<RecentUser>[] => [
  {
    key: 'nom',
    header: 'Utilisateur',
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {row.nom.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 leading-tight">{row.nom}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Rôle',
    width: 'w-24',
    render: (row) => {
      const cfg = USER_ROLE_BADGE[row.role];
      return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
    },
  },
  {
    key: 'status',
    header: 'Statut',
    width: 'w-32',
    render: (row) => {
      const cfg = USER_STATUS_BADGE[row.status];
      return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
    },
  },
  {
    key: 'registeredAt',
    header: 'Inscription',
    width: 'w-36',
    render: (row) => (
      <span className="text-xs text-slate-400 whitespace-nowrap">{row.registeredAt}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: 'w-10',
    render: (row) => (
      <button
        onClick={(e) => { e.stopPropagation(); onViewUser(row.id); }}
        className="p-1.5 text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
        aria-label={`Voir le profil de ${row.nom}`}
      >
        <Eye size={15} />
      </button>
    ),
  },
];

// ─── Page principale ──────────────────────────────────────────────────────────

interface AdminDashboardPageProps {
  userName?: string;
  notificationCount?: number;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  userName,
  notificationCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // File de modération locale — permet d'approuver/rejeter sans rechargement
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 300));
        const loaded = adminMockData as AdminDashboardData;
        setData(loaded);
        setModerationQueue(loaded.moderationQueue);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  // Handlers modération — TODO: remplacer par appels API PATCH /api/admin/biens/{id}
  const handleApprove = (id: number) => {
    setModerationQueue((prev) => prev.filter((item) => item.id !== id));
  };
  const handleReject = (id: number) => {
    setModerationQueue((prev) => prev.filter((item) => item.id !== id));
  };
  const handleView = (id: number) => {
    navigate(`/admin/moderation/${id}`);
  };
  const handleViewUser = (id: number) => {
    navigate(`/admin/utilisateurs/${id}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout userName={userName} userRole="ADMIN" notificationCount={notificationCount}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Chargement du tableau de bord…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const { platformStats } = data;
  const totalAbonnements =
    platformStats.abonnementsActifs.starter +
    platformStats.abonnementsActifs.business +
    platformStats.abonnementsActifs.premium;

  const moderationColumns = getModerationColumns(handleApprove, handleReject, handleView);
  const userColumns = getUserColumns(handleViewUser);

  return (
    <DashboardLayout userName={userName} userRole="ADMIN" notificationCount={notificationCount}>
      <div className="space-y-6">

        {/* ── Alerte post-login ──────────────────────────────────────────── */}
        {locationState?.message && (
          <MessageAlert type="success" message={locationState.message} />
        )}

        {/* ── En-tête ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-cyan-600" aria-hidden="true" />
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">
                Administration
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vue d'ensemble de la plateforme ImmoNet en temps réel.
            </p>
          </div>

          {/* Alerte si modération urgente */}
          {moderationQueue.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle size={15} className="text-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-amber-700">
                {moderationQueue.length} élément{moderationQueue.length > 1 ? 's' : ''} en attente de modération
              </span>
              <button
                onClick={() => navigate('/admin/moderation')}
                className="text-xs text-amber-600 font-semibold hover:underline ml-1"
              >
                Traiter →
              </button>
            </div>
          )}
        </div>

        {/* ── KPIs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              icon={resolveIcon(kpi.icon)}
              title={kpi.title}
              value={kpi.value}
              unit={kpi.unit}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
              positive={kpi.positive}
              urgent={kpi.urgent}
            />
          ))}
        </div>

        {/* ── File de modération ─────────────────────────────────────────── */}
        <Card variant="default" className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">File de modération</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Annonces, demandes Pro et signalements à traiter
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/moderation')}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 transition-colors"
            >
              Tout voir <ArrowRight size={13} />
            </button>
          </div>
          <DataTable<ModerationItem>
            columns={moderationColumns}
            data={moderationQueue}
            isLoading={isLoading}
            rowKey={(row) => row.id}
            emptyMessage="Aucun élément en attente de modération 🎉"
          />
        </Card>

        {/* ── Utilisateurs récents + Stats plateforme ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Utilisateurs récents — 2/3 */}
          <div className="lg:col-span-2">
            <Card variant="default" className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900 text-base">Utilisateurs récents</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Dernières inscriptions sur la plateforme</p>
                </div>
                <button
                  onClick={() => navigate('/admin/utilisateurs')}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 transition-colors"
                >
                  Gérer <ArrowRight size={13} />
                </button>
              </div>
              <DataTable<RecentUser>
                columns={userColumns}
                data={data.recentUsers}
                isLoading={isLoading}
                rowKey={(row) => row.id}
                onRowClick={(row) => handleViewUser(row.id)}
                emptyMessage="Aucun utilisateur récent"
              />
            </Card>
          </div>

          {/* Stats plateforme — 1/3 */}
          <div className="space-y-4">

            {/* Stats générales */}
            <Card variant="default">
              <h2 className="font-semibold text-slate-900 text-base mb-1">Plateforme</h2>
              <p className="text-xs text-slate-400 mb-4">Indicateurs clés du jour</p>
              <div>
                <StatRow label="Taux d'occupation" value={platformStats.tauxOccupation} />
                <StatRow label="Annonces modérées aujourd'hui" value={platformStats.annoncesModereesAujourdhui} />
                <StatRow label="Logements vendus (total)" value={platformStats.logementsVendus} />
                <StatRow label="Logements loués (total)" value={platformStats.logementsLoues} />
                <StatRow
                  label="Signalements actifs"
                  value={platformStats.signalements}
                  highlight={platformStats.signalements > 0}
                />
              </div>
            </Card>

            {/* Répartition abonnements */}
            <Card variant="default">
              <h2 className="font-semibold text-slate-900 text-base mb-1">Abonnements actifs</h2>
              <p className="text-xs text-slate-400 mb-4">
                {totalAbonnements} abonnés au total
              </p>
              <div className="space-y-3.5">
                <SubscriptionBar
                  label="Starter"
                  count={platformStats.abonnementsActifs.starter}
                  total={totalAbonnements}
                  color="bg-slate-400"
                />
                <SubscriptionBar
                  label="Business"
                  count={platformStats.abonnementsActifs.business}
                  total={totalAbonnements}
                  color="bg-cyan-500"
                />
                <SubscriptionBar
                  label="Premium"
                  count={platformStats.abonnementsActifs.premium}
                  total={totalAbonnements}
                  color="bg-violet-500"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* ── Raccourcis admin ───────────────────────────────────────────── */}
        <div>
          <h2 className="font-semibold text-slate-900 text-base mb-1">Accès rapides</h2>
          <p className="text-xs text-slate-400 mb-4">Fonctions administratives principales</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Modération', path: '/admin/moderation', icon: ShieldCheck, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
              { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
              { label: 'Annonces', path: '/admin/annonces', icon: Building2, color: 'text-slate-700 bg-slate-50 border-slate-200' },
              { label: 'Statistiques', path: '/admin/statistiques', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            ].map(({ label, path, icon: Icon, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 p-4 rounded-2xl border bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 text-left group ${color}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color.split(' ').slice(1).join(' ')}`}>
                  <Icon size={17} aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
