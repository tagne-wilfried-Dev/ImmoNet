import type { PropertySummary } from './property.types';

export type StatutVisite = 'EN_ATTENTE' | 'CONFIRMEE' | 'REFUSEE' | 'ANNULEE' | 'REALISEE';

export enum StatutReservation {
    EN_ATTENTE,
    CONFIRMEE,
    ANNULEE,
    REFUSEE,
    TERMINEE,
    PAYEE
}
export interface VisitRequest {
  bienId: number;
  dateSouhaitee: string; // Format YYYY-MM-DD
  heureSouhaitee: string; // Format HH:mm
  messageClient?: string;
}

export interface VisitResponse {
  id: number;
  bien: PropertySummary;
  client: {
    id: number;
    nom: string;
    prenom: string;
    telephone?: string;
  };
  proprietaire: {
    id: number;
    nom: string;
    prenom: string;
    estPro: boolean;
    telephone?: string;
  };
  dateSouhaitee: string;
  heureSouhaitee: string;
  statut: StatutVisite;
  messageClient?: string;
  motifRefus?: string;
  createdAt: string;
}


