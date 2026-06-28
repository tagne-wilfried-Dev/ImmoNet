import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Building2, Check, X, Clock, Eye, MessageSquare, Loader2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const ClientReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      toast.error('Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await reservationService.updateStatus(id, StatutReservation.ANNULEE);
      toast.success('Réservation annulée.');
      fetchReservations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'annulation.');
    }
  };

  const handlePay = async (id: number) => {
    if (!window.confirm('Confirmer le paiement de cette réservation ?')) return;
    try {
      await reservationService.updateStatus(id, StatutReservation.PAYEE);
      toast.success('Paiement confirmé, votre séjour est réservé !');
      fetchReservations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du paiement.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Mes réservations</h1>
          <p className="text-sm text-slate-600 mt-1">Gérez vos demandes de location et séjours</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Bien</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Montant</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Chargement de vos séjours...</p>
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((res) => {
                  const config = statusConfig[res.statut] || statusConfig[StatutReservation.EN_ATTENTE];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                             {res.bienImage ? (
                               <img src={getMediaUrl(res.bienImage)} alt={res.bienTitre} className="w-full h-full object-cover" />
                             ) : (
                               <Building2 className="w-6 h-6 text-slate-300 m-auto mt-3" />
                             )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{res.bienTitre}</p>
                            <p className="text-xs text-slate-500 font-mono">#{res.id} • {res.bienVille}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {format(new Date(res.dateDebut), 'dd MMM', { locale: fr })} - {format(new Date(res.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-900 tabular-nums">
                        {new Intl.NumberFormat('fr-FR').format(res.montantTotal)} {res.devise}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <StatusIcon size={12} /> {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/dashboard/messages`} 
                            state={{ initialBienId: res.bienId, initialTitre: res.bienTitre }}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Contacter le propriétaire"
                          >
                            <MessageSquare size={16} />
                          </Link>
                          <Link 
                            to={`/biens/${res.bienId}`}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Voir le bien"
                          >
                            <Eye size={16} />
                          </Link>
                          {res.statut === StatutReservation.CONFIRMEE && (
                            <button
                              onClick={() => handlePay(res.id)}
                              className="px-3 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors inline-flex items-center gap-1.5"
                              title="Payer la réservation"
                            >
                              <CreditCard size={14} /> Payer
                            </button>
                          )}
                          {(res.statut === StatutReservation.EN_ATTENTE || res.statut === StatutReservation.CONFIRMEE) && (
                            <button
                              onClick={() => handleCancel(res.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Annuler la réservation"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                     <div className="max-w-xs mx-auto">
                        <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-bold">Aucune réservation</h3>
                        <p className="text-slate-500 text-sm mt-1">Vous n'avez pas encore effectué de demande de séjour.</p>
                     </div>
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

export default ClientReservationsPage;
