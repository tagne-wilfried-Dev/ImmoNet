import React, { useEffect, useMemo, useState } from 'react';
import { Users, Search, ShieldCheck, Ban, UserCheck, Pause } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import type { Column } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/services/AdminService';
import type { AdminUser, AdminUserStatut, UserRole } from '@/lib/types/admin.types';
import { toast } from 'sonner';

const STATUT_BADGE: Record<AdminUserStatut, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  ACTIVE: { label: 'Actif', variant: 'success' },
  SUSPENDED: { label: 'Suspendu', variant: 'warning' },
  BANNED: { label: 'Banni', variant: 'error' },
};

const ROLE_BADGE: Record<UserRole, { label: string; variant: 'default' | 'info' | 'warning' }> = {
  CLIENT: { label: 'Client', variant: 'default' },
  PRO: { label: 'Pro', variant: 'info' },
  ADMIN: { label: 'Admin', variant: 'warning' },
};

const UtilisateursPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      toast.error('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatut = async (user: AdminUser, statut: AdminUserStatut) => {
    try {
      const updated = await adminService.updateUserStatut(user.id, statut);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(`${user.prenom ?? ''} ${user.nom} — ${STATUT_BADGE[statut].label.toLowerCase()}.`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de statut.');
    }
  };

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.nom.toLowerCase().includes(q) ||
        (u.prenom ?? '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const columns: Column<AdminUser>[] = [
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
        const cfg = ROLE_BADGE[row.role];
        return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: 'nbBiens',
      header: 'Biens',
      width: 'w-20',
      render: (row) => <span className="text-sm text-slate-600 font-mono">{row.nbBiens}</span>,
    },
    {
      key: 'statut',
      header: 'Statut',
      width: 'w-28',
      render: (row) => {
        const cfg = STATUT_BADGE[row.statut];
        return <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 'w-40',
      render: (row) => {
        if (row.role === 'ADMIN') {
          return <span className="text-xs text-slate-300 italic">Protégé</span>;
        }
        return (
          <div className="flex items-center gap-1">
            {row.statut !== 'ACTIVE' && (
              <button
                onClick={() => handleStatut(row, 'ACTIVE')}
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Réactiver"
              >
                <UserCheck size={15} />
              </button>
            )}
            {row.statut !== 'SUSPENDED' && (
              <button
                onClick={() => handleStatut(row, 'SUSPENDED')}
                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Suspendre"
              >
                <Pause size={15} />
              </button>
            )}
            {row.statut !== 'BANNED' && (
              <button
                onClick={() => handleStatut(row, 'BANNED')}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Bannir"
              >
                <Ban size={15} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-cyan-600" />
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <Users size={22} /> Gestion des utilisateurs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''} sur la plateforme
          </p>
        </div>

        <Card variant="default" className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher nom, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-colors"
              />
            </div>
          </div>
          <DataTable<AdminUser>
            columns={columns}
            data={filtered}
            isLoading={loading}
            rowKey={(row) => row.id}
            emptyMessage="Aucun utilisateur trouvé."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UtilisateursPage;
