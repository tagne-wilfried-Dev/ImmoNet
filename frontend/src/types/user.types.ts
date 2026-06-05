
export interface UserDto {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role:string;
  dateInscription: string; // ISO date string
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