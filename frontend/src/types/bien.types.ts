export enum TypeBien {
  APPARTEMENT = 'APPARTEMENT',
  VILLA = 'VILLA',
  STUDIO = 'STUDIO',
  TERRAIN = 'TERRAIN',
  BUREAU = 'BUREAU',
  LOCAL_COMMERCIAL = 'LOCAL_COMMERCIAL',
  APPARTEMENT_MEUBLEE = 'APPARTEMENT_MEUBLEE',
  MAISON = 'MAISON'
}

export enum TypeOperation {
  VENTE = 'VENTE',
  LOCATION = 'LOCATION'
}

export enum StatutAnnonce {
  BROUILLON = 'BROUILLON',
  PUBLIE = 'PUBLIE',
  EN_LOCATION = 'EN_LOCATION',
  VENDU = 'VENDU',
  ARCHIVE = 'ARCHIVE',
  SUSPENDU = 'SUSPENDU'
}

export interface ProprietaireSummaryDTO {
  id: number;
  nom: string;
  prenom: string;
  estPro: boolean;
  telephone: string;
}

export interface BienFilterRequest {
  ville?: string;
  quartier?: string;
  typeOperation?: TypeOperation;
  typeBien?: TypeBien;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  nbChambres?: number;
  estMeuble?: boolean;
}

export interface BienSummaryResponse {
  id: number;
  titre: string;
  prix: number;
  ville: string;
  typeBien: TypeBien;
  typeOperation: TypeOperation;
  urlPhotoPrincipale?: string;
  nbVues: number;
  statut: StatutAnnonce;
}

export interface BienDetailResponse {
  id: number;
  typeBien: TypeBien;
  typeOperation: TypeOperation;
  statut: StatutAnnonce;
  ville: string;
  quartier: string;
  prix: number;
  surface: number;
  nbChambres: number;
  estMeuble: boolean;
  description: string;
  urlsPhotos: string[];
  proprietaire: ProprietaireSummaryDTO;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
