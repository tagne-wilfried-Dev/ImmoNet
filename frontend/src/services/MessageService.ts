import api from '@/lib/axios';
import type { ConversationResponse, MessageRequest, MessageResponse } from '@/lib/types/message.types';

export const messageService = {
  /**
   * Lister toutes les conversations de l'utilisateur
   */
  getConversations: async (): Promise<ConversationResponse[]> => {
    const response = await api.get<ConversationResponse[]>('/messages/conversations');
    return response.data;
  },

  /**
   * Récupérer les messages d'une conversation spécifique
   */
  getMessages: async (conversationId: number): Promise<MessageResponse[]> => {
    const response = await api.get<MessageResponse[]>(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  /**
   * Envoyer un nouveau message
   */
  sendMessage: async (data: MessageRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/messages', data);
    return response.data;
  }
};
