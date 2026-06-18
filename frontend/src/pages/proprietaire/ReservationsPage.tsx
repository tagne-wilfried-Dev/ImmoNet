import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Check, X, Clock, Loader2, Building2 } from 'lucide-react';
import { reservationService } from '@/services/ReservationService';
import { type ReservationResponse } from '@/lib/types/reservation.types';
import { StatutReservation } from '@/lib/types/visit.types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMediaUrl } from '@/lib/utils';

const statusConfig: Record<StatutReservation, { color: string; icon: React.ElementType; label: string }> = {
  [StatutReservation.EN_ATTENTE]: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'En attente' },
  [StatutReservation.CONFIRMEE]: { color: 'bg-emerald-100 text-emerald-700', icon: Check, label: 'Confirmée' },
  [StatutReservation.ANNULEE]: { color: 'bg-red-100 text-red-700', icon: X, label: 'Annulée' },
  [StatutReservation.REFUSEE]: { color: 'bg-slate-100 text-slate-600', icon: X, label: 'Refusée' },
  [StatutReservation.TERMINEE]: { color: 'bg-blue-100 text-blue-700', icon: Check, label: 'Terminée' },
  [StatutReservation.PAYEE]: { color: 'bg-cyan-100 text-cyan-700', icon: Check, label: 'Payée' },
};

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReceivedReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error fetching received reservations:', err);
      toast.error('Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAction = async (id: number, newStatus: StatutReservation) => {
    try {
      await reservationService.updateStatus(id, newStatus);
      toast.success(newStatus === StatutReservation.CONFIRMEE ? 'Réservation acceptée !' : 'Réservation refusée.');
      fetchReservations();
    } catch (err) {
      toast.error('Erreur lors du changement de statut.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Gestion des réservations</h1>
          <p className="text-sm text-slate-600 mt-1">Suivez et gérez les demandes de séjour sur vos biens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="En attente" count={reservations.filter(r => r.statut === StatutReservation.EN_ATTENTE).length} color="text-amber-600" />
          <StatCard label="Confirmées" count={reservations.filter(r => r.statut === StatutReservation.CONFIRMEE).length} color="text-emerald-600" />
          <StatCard label="Terminées" count={reservations.filter(r => r.statut === StatutReservation.TERMINEE).length} color="text-blue-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Bien</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Revenu</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Accès aux demandes...</p>
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((res) => {
                  const config = statusConfig[res.statut] || statusConfig[StatutReservation.EN_ATTENTE];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                             {res.bienImage ? (
                               <img src={getMediaUrl(res.bienImage)} alt={res.bienTitre} className="w-full h-full object-cover" />
                             ) : (
                               <Building2 className="w-5 h-5 text-slate-300 m-auto mt-2.5" />
                             )}
                          </div>
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{res.bienTitre}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <User size={16} className="text-slate-400" /> {res.clientNomComplet}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {format(new Date(res.dateDebut), 'dd MMM', { locale: fr })} - {format(new Date(res.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-900">
                        {new Intl.NumberFormat('fr-FR').format(res.montantTotal)} {res.devise}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <StatusIcon size={12} /> {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {res.statut === StatutReservation.EN_ATTENTE && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleAction(res.id, StatutReservation.CONFIRMEE)}
                              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Check size={14} /> Accepter
                            </button>
                            <button 
                              onClick={() => handleAction(res.id, StatutReservation.REFUSEE)}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <X size={14} /> Refuser
                            </button>
                          </div>
                        )}
                        {res.statut !== StatutReservation.EN_ATTENTE && <span className="text-xs text-slate-400">—</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                    Aucune demande de réservation reçue pour le moment.
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

const StatCard = ({ label, count, color }: { label: string; count: number; color: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-600">{label}</p>
    <p className={`text-2xl font-display font-bold mt-1 ${color}`}>{count}</p>
  </div>
);

export default ReservationsPage;
