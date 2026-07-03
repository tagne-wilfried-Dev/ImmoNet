import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Search, ShieldCheck, Megaphone, Pause, Archive } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import type { Column } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/services/AdminService';
import type { AdminBien } from '@/lib/types/admin.types';
import { getMediaUrl } from '@/lib/utils';
import { toast } from 'sonner';

type BienStatut = AdminBien['statut'];

const STATUT_BADGE: Record<BienStatut, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  BROUILLON: { label: 'Brouillon', variant: 'default' },
  PUBLIE: { label: 'Publié', variant: 'success' },
  EN_LOCATION: { label: 'En location', variant: 'info' },
  VENDU: { label: 'Vendu', variant: 'info' },
  ARCHIVE: { label: 'Archivé', variant: 'error' },
  SUSPENDU: { label: 'Suspendu', variant: 'warning' },
};

const AdminAnnoncesPage: React.FC = () => {
  const [biens, setBiens] = useState<AdminBien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<BienStatut | 'all'>('all');

  const fetchBiens = async () => {
    try {
      setLoading(true);
      const data = await adminService.getBiens();
      setBiens(data);
    } catch (err) {
      console.error('Erreur chargement biens:', err);
      toast.error('Impossible de charger les biens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiens();
  }, []);

  const handleStatut = async (bien: AdminBien, statut: BienStatut) => {
    try {
      const updated = await adminService.updateBienStatut(bien.id, statut);
      setBiens((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success(`« ${bien.titre} » — ${STATUT_BADGE[statut].label.toLowerCase()}.`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modération.');
    }
  };

  const filtered = useMemo(() => {
    return biens.filter((b) => {
      const matchStatut = filterStatut === 'all' || b.statut === filterStatut;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        b.titre.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q) ||
        b.proprietaireNom.toLowerCase().includes(q);
      return matchStatut && matchSearch;
    });
  }, [biens, search, filterStatut]);

  const columns: Column<AdminBien>[] = [
    {
      key: 'titre',
      header: 'Bien',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {row.urlPhotoPrincipale ? (
              <img src={getMediaUrl(row.urlPhotoPrincipale)} alt="" className="w-full h-full object-cover" />
            ) : (
              <Building2 size={18} className="text-slate-300 m-auto mt-2.5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate max-w-[180px]">{row.titre}</p>
            <p className="text-xs text-slate-400">{row.ville}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'proprietaireNom',
      header: 'Propriétaire',
      render: (row) => (
        <div>
          <p className="text-sm text-slate-700">{row.proprietaireNom}</p>
          <p className="text-xs text-slate-400">{row.proprietaireEmail}</p>
        </div>
      ),
    },
    {
      key: 'prix',
      header: 'Prix',
      width: 'w-28',
      render: (row) => (
        <span className="text-sm font-mono font-semibold text-slate-700">
          {new Intl.NumberFormat('fr-FR').format(row.prix)} CFA
        </span>
      ),
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
      width: 'w-36',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.statut !== 'PUBLIE' && row.statut !== 'ARCHIVE' && (
            <button
              onClick={() => handleStatut(row, 'PUBLIE')}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Publier"
            >
              <Megaphone size={15} />
            </button>
          )}
          {row.statut === 'PUBLIE' && (
            <button
              onClick={() => handleStatut(row, 'SUSPENDU')}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Suspendre"
            >
              <Pause size={15} />
            </button>
          )}
          {row.statut !== 'ARCHIVE' && (
            <button
              onClick={() => handleStatut(row, 'ARCHIVE')}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Archiver"
            >
              <Archive size={15} />
            </button>
          )}
        </div>
      ),
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
            <Building2 size={22} /> Modération des annonces
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {biens.length} bien{biens.length > 1 ? 's' : ''} au total · suspendre, republier ou archiver n'importe quel bien
          </p>
        </div>

        <Card variant="default" className="p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-slate-100">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher titre, ville, propriétaire…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-colors"
              />
            </div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as BienStatut | 'all')}
              className="text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-colors cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUT_BADGE).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
          <DataTable<AdminBien>
            columns={columns}
            data={filtered}
            isLoading={loading}
            rowKey={(row) => row.id}
            emptyMessage="Aucun bien trouvé."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnnoncesPage;
