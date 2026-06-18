import { StatutReservation } from "./visit.types";

export type ReservationType = 'LOCATION' | 'VISITE' | 'ACHAT';

export interface ReservationRequest {
  bienId: number;
  dateDebut: string;
  dateFin: string;
  messageClient?: string;
}

export interface ReservationResponse {
  id: number;
  bienId: number;
  bienTitre: string;
  bienImage: string;
  bienVille: string;
  clientId: number;
  clientNomComplet: string;
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  devise: string;
  statut: StatutReservation;
  typeReservation: ReservationType;
  messageClient: string;
  createdAt: string;
}
