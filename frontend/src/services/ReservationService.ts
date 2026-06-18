import api from '@/lib/axios';
import type { ReservationRequest, ReservationResponse } from '@/lib/types/reservation.types';
import { StatutReservation } from '@/lib/types/visit.types';

export const reservationService = {
  /**
   * Créer une nouvelle demande de réservation
   */
  createReservation: async (data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await api.post<ReservationResponse>('/reservations', data);
    return response.data;
  },

  /**
   * Lister les réservations du client connecté
   */
  getMyReservations: async (): Promise<ReservationResponse[]> => {
    const response = await api.get<ReservationResponse[]>('/reservations/client');
    return response.data;
  },

  /**
   * Lister les réservations reçues par le propriétaire
   */
  getReceivedReservations: async (): Promise<ReservationResponse[]> => {
    const response = await api.get<ReservationResponse[]>('/reservations/proprietaire');
    return response.data;
  },

  /**
   * Mettre à jour le statut d'une réservation (Accepter, Refuser, Annuler)
   */
  updateStatus: async (id: number, statut: StatutReservation): Promise<ReservationResponse> => {
    const response = await api.patch<ReservationResponse>(`/reservations/${id}/statut`, null, {
      params: { statut }
    });
    return response.data;
  }
};
