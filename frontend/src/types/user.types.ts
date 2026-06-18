
export interface AbonnementSummary {
  typeAbonnement: 'GRATUIT' | 'STARTER' | 'BUSINESS' | 'PREMIUM';
  dateDebut: string;
  actif: boolean;
}

export interface UserDto {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'CLIENT' | 'PRO' | 'ADMIN';
  statut: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  emailVerifie: boolean;
  avatarUrl?: string;
  dateInscription: string;
  dernierLogin?: string;
  abonnement?: AbonnementSummary;
}

export interface SimpleUser {
  nom: string;
  role:string;
}

export interface UpdateProfileRequest {
  nom: string;
  prenom: string;
  telephone: string;
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}