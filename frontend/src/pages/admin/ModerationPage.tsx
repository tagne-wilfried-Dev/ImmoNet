import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Building2,
    UserCheck,
    Flag,
    Eye,
    CheckCircle2,
    XCircle,
    Search,
    SlidersHorizontal,
    AlertTriangle,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/dashboard/DataTable';
import type { Column } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type {
    ModerationItem,
    ModerationItemType,
    ModerationStatus,
} from '@/lib/types/admin.types';
import adminMockData from '@/lib/data/mockDataAdmin.json';

// ─── Config visuelle ──────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
    ModerationItemType,
    { label: string; icon: LucideIcon; color: string }
> = {
    annonce: {
        label: 'Annonce',
        icon: Building2,
        color: 'text-cyan-700 bg-cyan-50',
    },
    pro_request: {
        label: 'Demande Pro',
        icon: UserCheck,
        color: 'text-violet-700 bg-violet-50',
    },
    signalement: {
        label: 'Signalement',
        icon: Flag,
        color: 'text-red-600 bg-red-50',
    },
};

const STATUS_CONFIG: Record<
    ModerationStatus,
    { label: string; variant: 'warning' | 'error' }
> = {
    pending: { label: 'En attente', variant: 'warning' },
    flagged: { label: 'Signalé', variant: 'error' },
};

// ─── Modal rejet ──────────────────────────────────────────────────────────────

interface RejectModalProps {
    item: ModerationItem | null;
    onConfirm: (id: number, motif: string) => void;
    onClose: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ item, onConfirm, onClose }) => {
    const [motif, setMotif] = useState('');

    // Reset motif à chaque ouverture (déféré pour éviter setState synchrone dans l'effet)
    useEffect(() => {
        if (item) {
            const t = setTimeout(() => setMotif(''), 0);
            return () => clearTimeout(t);
        }
    }, [item]);

    if (!item) return null;

    const handleConfirm = () => {
        if (!motif.trim()) return;
        onConfirm(item.id, motif.trim());
    };

    return (
        // Overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="reject-modal-title"
        >
            {/* Container — stoppe la propagation du click overlay */}
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2
                            id="reject-modal-title"
                            className="font-semibold text-slate-900 text-base"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                            Rejeter l'élément
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                            {item.title} · <span className="text-slate-500">{item.submittedBy}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                        aria-label="Fermer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Champ motif */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="reject-motif"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Motif du rejet <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="reject-motif"
                        rows={3}
                        value={motif}
                        onChange={(e) => setMotif(e.target.value)}
                        placeholder="Ex : Photos insuffisantes, description incomplète, contenu non conforme…"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400
              resize-none focus:outline-none
              focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10
              transition-colors
            "
                    />
                    {motif.trim() === '' && (
                        <p className="text-xs text-red-400">Le motif est obligatoire.</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={!motif.trim()}
                    >
                        <XCircle size={15} />
                        Confirmer le rejet
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Page principale ──────────────────────────────────────────────────────────

interface ModerationPageProps {
    userName?: string;
    notificationCount?: number;
}

const ModerationPage: React.FC<ModerationPageProps> = ({
    userName = 'Administrateur',
    notificationCount = 0,
}) => {
    const navigate = useNavigate();

    // ── État local ──────────────────────────────────────────────────────────────
    const [queue, setQueue] = useState<ModerationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<ModerationItemType | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<ModerationStatus | 'all'>('all');

    // Modal rejet
    const [itemToReject, setItemToReject] = useState<ModerationItem | null>(null);

    // ── Chargement mock ─────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            setQueue(adminMockData.moderationQueue as ModerationItem[]);
            setIsLoading(false);
        };
        void load();
    }, []);

    // ── Données filtrées ────────────────────────────────────────────────────────
    const filteredQueue = useMemo(() => {
        return queue.filter((item) => {
            const matchType = filterType === 'all' || item.type === filterType;
            const matchStatus = filterStatus === 'all' || item.status === filterStatus;
            const matchSearch =
                searchQuery === '' ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
            return matchType && matchStatus && matchSearch;
        });
    }, [queue, filterType, filterStatus, searchQuery]);

    // ── Compteurs pour les chips de synthèse ───────────────────────────────────
    const counts = useMemo(
        () => ({
            total: queue.length,
            pending: queue.filter((i) => i.status === 'pending').length,
            flagged: queue.filter((i) => i.status === 'flagged').length,
            annonces: queue.filter((i) => i.type === 'annonce').length,
            pro: queue.filter((i) => i.type === 'pro_request').length,
            signalements: queue.filter((i) => i.type === 'signalement').length,
        }),
        [queue],
    );

    // ── Handlers ────────────────────────────────────────────────────────────────
    // TODO : remplacer par PATCH /api/admin/biens/{id} { statut: 'PUBLIE' }
    const handleApprove = (id: number) => {
        setQueue((prev) => prev.filter((item) => item.id !== id));
    };

    // TODO : remplacer par PATCH /api/admin/biens/{id} { statut: 'REJETE', motif }
    const handleRejectConfirm = (id: number, motif: string) => {
        // TODO: appeler l'API pour enregistrer le motif de rejet
        // utilison le motif ici pour éviter l'avertissement "defined but never used"
        console.log('Rejeté', id, motif);
        setQueue((prev) => prev.filter((item) => item.id !== id));
        setItemToReject(null);
    };

    const handleView = (id: number) => {
        navigate(`/admin/moderation/${id}`);
    };

    // ── Colonnes DataTable ──────────────────────────────────────────────────────
    const columns: Column<ModerationItem>[] = [
        {
            key: 'type',
            header: 'Type',
            width: 'w-36',
            render: (row) => {
                const config = TYPE_CONFIG[row.type];
                const TypeIcon = config.icon;
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}
                    >
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
                    <p className="text-sm font-medium text-slate-800 leading-tight">
                        {row.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Par {row.submittedBy}</p>
                </div>
            ),
        },
        {
            key: 'submittedAt',
            header: 'Soumis',
            width: 'w-32',
            render: (row) => (
                <span className="text-xs text-slate-400 whitespace-nowrap">
                    {row.submittedAt}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Statut',
            width: 'w-28',
            render: (row) => {
                const cfg = STATUS_CONFIG[row.status];
                return (
                    <Badge variant={cfg.variant} size="sm">
                        {cfg.label}
                    </Badge>
                );
            },
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'w-36',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(row.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        aria-label="Voir le détail"
                        title="Voir"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(row.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        aria-label="Approuver"
                        title="Approuver"
                    >
                        <CheckCircle2 size={15} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setItemToReject(row);
                        }}
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

    // ── Rendu ───────────────────────────────────────────────────────────────────
    return (
        <DashboardLayout
            userName={userName}
            userRole="ADMIN"
            notificationCount={notificationCount}
        >
            <div className="space-y-6">

                {/* ── En-tête ──────────────────────────────────────────────────────── */}
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
                            File de modération
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Validez, rejetez ou signalez les éléments en attente de révision.
                        </p>
                    </div>

                    {/* Alerte signalements actifs */}
                    {counts.flagged > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-2xl">
                            <AlertTriangle
                                size={15}
                                className="text-red-500 shrink-0"
                                aria-hidden="true"
                            />
                            <span className="text-sm font-medium text-red-700">
                                {counts.flagged} signalement{counts.flagged > 1 ? 's' : ''} à traiter en priorité
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Chips de synthèse ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Total', value: counts.total, color: 'text-slate-700 bg-white border-slate-200' },
                        { label: 'En attente', value: counts.pending, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                        { label: 'Signalés', value: counts.flagged, color: 'text-red-600 bg-red-50 border-red-200' },
                        { label: 'Annonces', value: counts.annonces, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
                        { label: 'Demandes Pro', value: counts.pro, color: 'text-violet-700 bg-violet-50 border-violet-200' },
                        { label: 'Signalements', value: counts.signalements, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${color}`}
                        >
                            <span
                                className="text-2xl font-bold"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                {value}
                            </span>
                            <span className="text-xs font-medium mt-0.5 opacity-80">{label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Table + filtres ───────────────────────────────────────────────── */}
                <Card variant="default" className="p-0 overflow-hidden">

                    {/* Barre de filtres */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100">

                        {/* Recherche */}
                        <div className="relative flex-1 min-w-0 w-full sm:w-auto">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                placeholder="Rechercher titre, auteur…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                  w-full pl-9 pr-4 py-2 text-sm rounded-xl
                  border border-slate-200 bg-white text-slate-800
                  placeholder:text-slate-400
                  focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10
                  transition-colors
                "
                            />
                        </div>

                        {/* Filtre type */}
                        <div className="flex items-center gap-2 shrink-0">
                            <SlidersHorizontal
                                size={15}
                                className="text-slate-400"
                                aria-hidden="true"
                            />
                            <select
                                value={filterType}
                                onChange={(e) =>
                                    setFilterType(e.target.value as ModerationItemType | 'all')
                                }
                                className="
                  text-sm rounded-xl border border-slate-200 bg-white
                  px-3 py-2 text-slate-700
                  focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10
                  transition-colors cursor-pointer
                "
                                aria-label="Filtrer par type"
                            >
                                <option value="all">Tous les types</option>
                                <option value="annonce">Annonces</option>
                                <option value="pro_request">Demandes Pro</option>
                                <option value="signalement">Signalements</option>
                            </select>

                            {/* Filtre statut */}
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value as ModerationStatus | 'all')
                                }
                                className="
                  text-sm rounded-xl border border-slate-200 bg-white
                  px-3 py-2 text-slate-700
                  focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10
                  transition-colors cursor-pointer
                "
                                aria-label="Filtrer par statut"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="flagged">Signalés</option>
                            </select>
                        </div>

                        {/* Reset filtres — visible seulement si un filtre est actif */}
                        {(filterType !== 'all' || filterStatus !== 'all' || searchQuery !== '') && (
                            <button
                                onClick={() => {
                                    setFilterType('all');
                                    setFilterStatus('all');
                                    setSearchQuery('');
                                }}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors shrink-0 flex items-center gap-1"
                            >
                                <X size={13} />
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {/* Résultat count */}
                    {!isLoading && (
                        <div className="px-5 py-2.5 border-b border-slate-50 bg-slate-50/50">
                            <p className="text-xs text-slate-400">
                                <span className="font-semibold text-slate-600">
                                    {filteredQueue.length}
                                </span>{' '}
                                élément{filteredQueue.length !== 1 ? 's' : ''} affiché
                                {filteredQueue.length !== 1 ? 's' : ''}
                                {filteredQueue.length !== queue.length && (
                                    <span className="ml-1 text-slate-400">
                                        sur {queue.length} au total
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    <DataTable<ModerationItem>
                        columns={columns}
                        data={filteredQueue}
                        isLoading={isLoading}
                        rowKey={(row) => row.id}
                        onRowClick={(row) => handleView(row.id)}
                        emptyMessage={
                            queue.length === 0
                                ? 'Aucun élément en attente de modération 🎉'
                                : 'Aucun résultat pour ces filtres.'
                        }
                    />
                </Card>
            </div>

            {/* ── Modal rejet ──────────────────────────────────────────────────────── */}
            <RejectModal
                item={itemToReject}
                onConfirm={handleRejectConfirm}
                onClose={() => setItemToReject(null)}
            />
        </DashboardLayout>
    );
};

export default ModerationPage;