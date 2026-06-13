
export type OperationType = 'VENTE' | 'LOCATION';

export type PropertyType =
  | 'APPARTEMENT'
  | 'MAISON'
  | 'VILLA'
  | 'TERRAIN'
  | 'BUREAU'
  | 'COMMERCE'
  | 'STUDIO';

export type PropertyStatus =
  | 'BROUILLON'
  | 'EN_ATTENTE'
  | 'PUBLIE'
  | 'EN_LOCATION'
  | 'VENDU'
  | 'ARCHIVE';

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

// ─── Bien immobilier (vue liste/carte) ────────────────────────────────────────

export interface PropertySummary {
  id: number | string;
  titre?: string;
  typeOperation?: OperationType;
  typeBien?: PropertyType;
  statut?: PropertyStatus;
  prix?: number;
  nbPieces?: number;
  nbSallesDeBain?: number;
  ville?: string;
  quartier?: string;
  surface?: number;
  nbChambres?: number;
  urlPhotoPrincipale?: string;
  nbVues?: number;
  photos?: string[];
  localisation?: PropertyLocation;
  proprietaire?: PropertyOwner;
  createdAt?: string;
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
  periodeLocation?: string;
  
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
  MAISON: 'Maison',
  VILLA: 'Villa',
  TERRAIN: 'Terrain',
  BUREAU: 'Bureau',
  COMMERCE: 'Commerce',
  STUDIO: 'Studio',
};

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  VENTE: 'À vendre',
  LOCATION: 'À louer',
};

export const PAYS_OPTIONS = [
  { value: 'CM', label: 'Cameroun' },
  { value: 'CI', label: "Côte d'Ivoire" },
  { value: 'SN', label: 'Sénégal' },
  { value: 'TG', label: 'Togo' },
  { value: 'GA', label: 'Gabon' },
  { value: 'CG', label: 'Congo' },
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