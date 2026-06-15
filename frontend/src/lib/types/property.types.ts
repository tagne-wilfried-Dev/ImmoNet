
export type OperationType = 'VENTE' | 'LOCATION';

export type PropertyType =
  | 'APPARTEMENT'
  | 'VILLA'
  | 'STUDIO'
  | 'TERRAIN'
  | 'BUREAU'
  | 'LOCAL_COMMERCIAL'
  | 'APPARTEMENT_MEUBLEE'
  | 'MAISON';

export type PeriodeLocation = 'NUIT' | 'SEMAINE' | 'MOIS' | 'ANNEE';

export type PropertyStatus =
  | 'BROUILLON'
  | 'EN_ATTENTE'
  | 'PUBLIE'
  | 'EN_LOCATION'
  | 'VENDU'
  | 'ARCHIVE'
  | 'SUSPENDU';

// ─── Localisation ─────────────────────────────────────────────────────────────

export interface PropertyLocation {
  pays: string;
  ville: string;
  quartier?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Propriétaire (vue publique) ──────────────────────────────────────────────

export interface PropertyOwner {
  id: number | string;
  nom: string;
  prenom?: string;
  avatarUrl?: string;
  telephone?: string;
  estPro?: boolean;
  badgePro: boolean;
}

// ─── Requête de création (DTO Backend BienCreateRequest) ──────────────────────

export interface PropertyCreateRequest {
  titre: string;
  description?: string;
  typeOperation: OperationType;
  typeBien: PropertyType;
  adresse: string;
  ville: string;
  quartier?: string;
  pays: string;
  latitude?: number;
  longitude?: number;
  periodeLocation?: PeriodeLocation;
  prix: number;
  caution?: number;
  chargesIncluses?: boolean;
  prixNegoceable?: boolean;
  surface: number;
  nbPieces?: number;
  nbChambres?: number;
  nbSdb?: number;
  etage?: number;
  estMeuble?: boolean;
}

// ─── Bien immobilier (vue liste/carte) ────────────────────────────────────────

export interface PropertySummary {
  id: number | string;
  titre: string;
  typeOperation: OperationType;
  typeBien: PropertyType;
  statut: PropertyStatus;
  prix: number;
  ville: string;
  quartier?: string;
  surface: number;
  nbChambres?: number;
  nbPieces?: number;
  nbSdb?: number;
  urlPhotoPrincipale?: string;
  nbVues: number;
  createdAt: string;
}

// ─── Bien immobilier (vue détail) ─────────────────────────────────────────────

export interface PropertyDetail {
  id: number | string;
  titre: string;
  typeBien: PropertyType;
  typeOperation: OperationType;
  statut: PropertyStatus;
  
  description: string;
  adresse: string;
  ville: string;
  quartier: string;
  pays: string;
  latitude?: number;
  longitude?: number;
  
  prix: number;
  caution: number;
  chargesIncluses: boolean;
  prixNegoceable: boolean;
  periodeLocation?: PeriodeLocation;
  
  surface: number;
  nbPieces?: number;
  nbChambres?: number;
  nbSdb?: number;
  etage?: number;
  estMeuble: boolean;
  
  urlsPhotos: string[];
  equipements: string[];
  proprietaire: PropertyOwner;
  
  nbVues: number;
  nbFavoris: number;
  estBoost: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ─── Filtres de recherche ─────────────────────────────────────────────────────

export interface SearchFilters {
  typeOperation: OperationType;
  typeBien?: PropertyType;
  pays?: string;
  ville?: string;
  quartier?: string;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  nbPiecesMin?: number;
  rayon?: number;          // km, 1–50
  equipements?: string[];
}

// ─── Réponse paginée API ──────────────────────────────────────────────────────

export interface PaginatedProperties {
  data: PropertySummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Options UI (pour les selects/filtres) ────────────────────────────────────

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APPARTEMENT: 'Appartement',
  VILLA: 'Villa',
  STUDIO: 'Studio',
  TERRAIN: 'Terrain',
  BUREAU: 'Bureau',
  LOCAL_COMMERCIAL: 'Local Commercial',
  APPARTEMENT_MEUBLEE: 'Appartement Meublé',
  MAISON: 'Maison',
};

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  VENTE: 'À vendre',
  LOCATION: 'À louer',
};

export const PAYS_OPTIONS = [
  { value: 'Bénin', label: 'Bénin' },
  { value: 'Sénégal', label: 'Sénégal' },
  { value: 'Côte d\'Ivoire', label: "Côte d'Ivoire" },
  { value: 'Cameroun', label: 'Cameroun' },
  { value: 'Togo', label: 'Togo' },
  { value: 'Gabon', label: 'Gabon' },
] as const;

export const EQUIPEMENTS_OPTIONS = [
  'Climatisation',
  'Parking',
  'Piscine',
  'Sécurité 24h',
  'Groupe électrogène',
  'Eau courante',
  'Internet fibre',
  'Jardin',
  'Terrasse',
  'Ascenseur',
] as const;