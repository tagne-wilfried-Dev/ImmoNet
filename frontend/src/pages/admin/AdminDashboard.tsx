import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Building2,
  Megaphone,
  Flag,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import type { Column } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import MessageAlert from '@/components/ui/MessageAlert';
import { adminService } from '@/services/AdminService';
import type { AdminStats, AdminUser, AdminUserStatut, UserRole } from '@/lib/types/admin.types';
import { toast } from 'sonner';

// ─── Configs badge ────────────────────────────────────────────────────────────

const USER_STATUS_BADGE: Record<AdminUserStatut, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  ACTIVE: { label: 'Actif', variant: 'success' },
  SUSPENDED: { label: 'Suspendu', variant: 'warning' },
  BANNED: { label: 'Banni', variant: 'error' },
};

const USER_ROLE_BADGE: Record<UserRole, { label: string; variant: 'default' | 'info' | 'warning' }> = {
  CLIENT: { label: 'Client', variant: 'default' },
  PRO: { label: 'Pro', variant: 'info' },
  ADMIN: { label: 'Admin', variant: 'warning' },
};

// Libellés lisibles pour les statuts de bien
const STATUT_BIEN_LABEL: Record<string, string> = {
  BROUILLON: 'Brouillons',
  PUBLIE: 'Publiés',
  EN_LOCATION: 'En location',
  VENDU: 'Vendus',
  ARCHIVE: 'Archivés',
  SUSPENDU: 'Suspendus',
};

const PLAN_LABEL: Record<string, string> = {
  GRATUIT: 'Gratuit',
  STARTER: 'Starter',
  BUSINESS: 'Business',
  PREMIUM: 'Premium',
};

// ─── Sous-composants ──────────────────────────────────────────────────────────

const StatRow: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({
  label,
  value,
  highlight = false,
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-red-500' : 'text-slate-800'}`}>{value}</span>
  </div>
);

const SubscriptionBar: React.FC<{ label: string; count: number; total: number; color: string }> = ({
  label,
  count,
  total,
  color,
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="text-slate-700 font-semibold">
          {count} <span className="text-slate-400 font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Page principale ──────────────────────────────────────────────────────────

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Erreur chargement stats admin:', err);
        toast.error('Impossible de charger les statistiques.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const userColumns: Column<AdminUser>[] = [
    {
      key: 'nom',
      header: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {row.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 leading-tight">
              {row.prenom} {row.nom}
            </p>
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
      key: 'statut',
      header: 'Statut',
      width: 'w-28',
      render: (row) => {
        const cfg = USER_STATUS_BADGE[row.statut];
        return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: 'dateInscription',
      header: 'Inscription',
      width: 'w-32',
      render: (row) => <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(row.dateInscription)}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-10',
      render: () => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/admin/utilisateurs');
          }}
          className="p-1.5 text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
          aria-label="Gérer les utilisateurs"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Chargement du tableau de bord…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  const totalAbonnements = Object.values(stats.abonnementsParPlan).reduce((a, b) => a + b, 0);
  const planColors: Record<string, string> = {
    GRATUIT: 'bg-slate-300',
    STARTER: 'bg-slate-400',
    BUSINESS: 'bg-cyan-500',
    PREMIUM: 'bg-violet-500',
  };

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-6">

        {locationState?.message && <MessageAlert type="success" message={locationState.message} />}

        {/* En-tête */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Administration</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-500 mt-1">Vue d'ensemble de la plateforme ImmoNet en temps réel.</p>
          </div>

          {stats.signalementsActifs > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-2xl">
              <AlertTriangle size={15} className="text-red-500 shrink-0" />
              <span className="text-sm font-medium text-red-700">
                {stats.signalementsActifs} signalement{stats.signalementsActifs > 1 ? 's' : ''} actif
                {stats.signalementsActifs > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* KPIs réels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} title="Utilisateurs" value={String(stats.totalUtilisateurs)} trendLabel={`${stats.totalPros} pros · ${stats.totalClients} clients`} />
          <StatCard icon={Building2} title="Biens au total" value={String(stats.totalBiens)} trendLabel="patrimoine plateforme" />
          <StatCard icon={Megaphone} title="Annonces publiées" value={String(stats.biensPublies)} trendLabel="visibles sur le marché" />
          <StatCard icon={Flag} title="Signalements actifs" value={String(stats.signalementsActifs)} urgent={stats.signalementsActifs > 0} trendLabel="à traiter" />
        </div>

        {/* Utilisateurs récents + Stats plateforme */}
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
              <DataTable<AdminUser>
                columns={userColumns}
                data={stats.utilisateursRecents}
                rowKey={(row) => row.id}
                onRowClick={() => navigate('/admin/utilisateurs')}
                emptyMessage="Aucun utilisateur récent"
              />
            </Card>
          </div>

          {/* Stats plateforme — 1/3 */}
          <div className="space-y-4">
            <Card variant="default">
              <h2 className="font-semibold text-slate-900 text-base mb-1">Biens par statut</h2>
              <p className="text-xs text-slate-400 mb-4">Répartition du patrimoine</p>
              <div>
                {Object.keys(STATUT_BIEN_LABEL).map((key) => (
                  <StatRow key={key} label={STATUT_BIEN_LABEL[key]} value={stats.biensParStatut[key] ?? 0} />
                ))}
              </div>
            </Card>

            <Card variant="default">
              <h2 className="font-semibold text-slate-900 text-base mb-1">Abonnements</h2>
              <p className="text-xs text-slate-400 mb-4">{totalAbonnements} abonné{totalAbonnements > 1 ? 's' : ''} au total</p>
              <div className="space-y-3.5">
                {['GRATUIT', 'STARTER', 'BUSINESS', 'PREMIUM'].map((plan) => (
                  <SubscriptionBar
                    key={plan}
                    label={PLAN_LABEL[plan]}
                    count={stats.abonnementsParPlan[plan] ?? 0}
                    total={totalAbonnements}
                    color={planColors[plan]}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Raccourcis admin */}
        <div>
          <h2 className="font-semibold text-slate-900 text-base mb-1">Accès rapides</h2>
          <p className="text-xs text-slate-400 mb-4">Fonctions administratives principales</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
              { label: 'Annonces', path: '/admin/annonces', icon: Building2, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
              { label: 'Modération', path: '/admin/moderation', icon: ShieldCheck, color: 'text-slate-700 bg-slate-50 border-slate-200' },
              { label: 'Statistiques', path: '/admin/statistiques', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            ].map(({ label, path, icon: Icon, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 p-4 rounded-2xl border bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 text-left group ${color}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color.split(' ').slice(1).join(' ')}`}>
                  <Icon size={17} />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
