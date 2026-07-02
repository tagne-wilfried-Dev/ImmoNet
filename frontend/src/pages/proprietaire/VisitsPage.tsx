import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Check, X, Clock, Loader2, Building2, MessageSquare, Eye, CheckCircle2 } from 'lucide-react';
import { visitService } from '@/services/VisitService';
import { type VisitResponse, type StatutVisite } from '@/lib/types/visit.types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMediaUrl } from '@/lib/utils';
import { Link } from 'react-router-dom';

const statusConfig: Record<StatutVisite, { color: string; icon: React.ElementType; label: string }> = {
  EN_ATTENTE: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'En attente' },
  CONFIRMEE: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Check, label: 'Confirmée' },
  REFUSEE: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: X, label: 'Refusée' },
  ANNULEE: { color: 'bg-red-100 text-red-700 border-red-200', icon: X, label: 'Annulée' },
  REALISEE: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Réalisée' },
};

const VisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<VisitResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const data = await visitService.getMyReceivedRequests();
      setVisits(data);
    } catch (err) {
      console.error('Error fetching received visits:', err);
      toast.error('Impossible de charger les demandes de visite.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleAction = async (id: number, newStatus: StatutVisite) => {
    let motif: string | undefined;
    if (newStatus === 'REFUSEE') {
      const saisie = window.prompt('Motif du refus (optionnel) :', '');
      if (saisie === null) return; // annulé
      motif = saisie.trim() || undefined;
    }
    if (newStatus === 'REALISEE' && !window.confirm('Confirmer que la visite a bien eu lieu ?')) {
      return;
    }

    try {
      await visitService.updateVisitStatus(id, newStatus, motif);
      toast.success(
        newStatus === 'CONFIRMEE' ? 'Visite confirmée !' :
        newStatus === 'REFUSEE' ? 'Visite refusée.' : 'Visite marquée comme réalisée.'
      );
      fetchVisits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de statut.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Gestion des demandes de visite</h1>
          <p className="text-sm text-slate-600 mt-1">Gérez et planifiez les rendez-vous de visite sur vos biens immobiliers</p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="En attente" count={visits.filter(v => v.statut === 'EN_ATTENTE').length} color="text-amber-600" />
          <StatCard label="Confirmées" count={visits.filter(v => v.statut === 'CONFIRMEE').length} color="text-emerald-600" />
          <StatCard label="Réalisées" count={visits.filter(v => v.statut === 'REALISEE').length} color="text-blue-600" />
        </div>

        {/* Main Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Bien</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Client / Contact</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Date & Heure souhaitées</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Message</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Chargement des demandes de visite...</p>
                  </td>
                </tr>
              ) : visits.length > 0 ? (
                visits.map((visit) => {
                  const config = statusConfig[visit.statut] || statusConfig.EN_ATTENTE;
                  const StatusIcon = config.icon;
                  return (
                    <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                            {visit.bien?.urlsPhotos && visit.bien.urlsPhotos.length > 0 ? (
                              <img src={getMediaUrl(visit.bien.urlsPhotos[0])} alt={visit.bien.titre} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-slate-300 m-auto mt-2.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{visit.bien?.titre || 'Bien sans titre'}</p>
                            <p className="text-xs text-slate-500 font-mono">#{visit.bien?.id || '?'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{visit.client.prenom} {visit.client.nom}</span>
                          {visit.client.telephone && (
                            <span className="text-xs text-slate-500 font-mono">{visit.client.telephone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-700">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {format(new Date(visit.dateSouhaitee), 'dd MMMM yyyy', { locale: fr })}
                          </span>
                          <span className="text-xs text-slate-500">à {visit.heureSouhaitee}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 max-w-[200px] truncate" title={visit.messageClient || ''}>
                        {visit.messageClient || <span className="text-slate-400 italic">Aucun message</span>}
                        {visit.motifRefus && (
                          <div className="text-xs text-red-500 mt-1 italic" title={visit.motifRefus}>
                            Raison du refus: {visit.motifRefus}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          <StatusIcon size={12} /> {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to="/dashboard/messages" 
                            state={{ initialBienId: visit.bien.id, initialTitre: visit.bien.titre }}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Discuter avec le client"
                          >
                            <MessageSquare size={16} />
                          </Link>
                          <Link 
                            to={`/biens/${visit.bien.id}`}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Voir le bien"
                          >
                            <Eye size={16} />
                          </Link>
                          {visit.statut === 'EN_ATTENTE' && (
                            <>
                              <button
                                onClick={() => handleAction(visit.id, 'CONFIRMEE')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Confirmer le rendez-vous"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleAction(visit.id, 'REFUSEE')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Refuser le rendez-vous"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          {visit.statut === 'CONFIRMEE' && (
                            <button
                              onClick={() => handleAction(visit.id, 'REALISEE')}
                              className="px-2.5 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors inline-flex items-center gap-1.5"
                              title="Marquer comme réalisée"
                            >
                              <CheckCircle2 size={13} /> Visite effectuée
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Clock size={40} className="mx-auto mb-3 opacity-40 text-slate-400" />
                    <p className="font-medium text-slate-700">Aucune demande de visite</p>
                    <p className="text-xs text-slate-500 mt-1">Les demandes de visite de vos clients s'afficheront ici.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <span className={`text-2xl font-bold ${color}`}>{count}</span>
  </div>
);

export default VisitsPage;
