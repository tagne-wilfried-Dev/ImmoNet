package com.immoteam.immoteamdev.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.immoteam.immoteamdev.dto.ConversationResponse;
import com.immoteam.immoteamdev.dto.MessageResponse;
import com.immoteam.immoteamdev.entity.Conversation;
import com.immoteam.immoteamdev.entity.Message;
import com.immoteam.immoteamdev.entity.Utilisateur;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(source = "expediteur.email", target = "expediteurEmail")
    @Mapping(source = "expediteur.nom", target = "expediteurNom")
    @Mapping(source = "conversation.id", target = "conversationId")
    MessageResponse toResponse(Message message);

    default ConversationResponse toConversationResponse(Conversation conversation, Utilisateur currentUser, String dernierContenu, int unreadCount) {
        Utilisateur interlocuteur = conversation.getParticipant1().getId().equals(currentUser.getId()) 
                                    ? conversation.getParticipant2() 
                                    : conversation.getParticipant1();
        
        return ConversationResponse.builder()
                .id(conversation.getId())
                .bienId(conversation.getBien().getId())
                .bienTitre(conversation.getBien().getTitre())
                .bienPhotoUrl(conversation.getBien().getPhotos().isEmpty() ? null : conversation.getBien().getPhotos().get(0).getUrlCloudinary())
                .interlocuteurNom(interlocuteur.getNom())
                .interlocuteurPrenom(interlocuteur.getPrenom())
                .interlocuteurEmail(interlocuteur.getEmail())
                .dernierMessageContenu(dernierContenu)
                .dernierMessageAt(conversation.getDernierMessageAt())
                .messagesNonLus(unreadCount)
                .build();
    }
}
