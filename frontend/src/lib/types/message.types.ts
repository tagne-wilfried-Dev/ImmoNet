export interface MessageRequest {
  conversationId?: number;
  bienId?: number;
  contenu: string;
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  expediteurEmail: string;
  expediteurNom: string;
  typeMessage: 'TEXTE' | 'IMAGE' | 'DOCUMENT';
}

export interface ConversationResponse {
  id: number;
  bienId: number;
  bienTitre: string;
  bienPhotoUrl?: string;
  interlocuteurNom: string;
  interlocuteurPrenom: string;
  interlocuteurEmail: string;
  dernierMessageContenu: string;
  dernierMessageAt: string;
  messagesNonLus: number;
}
