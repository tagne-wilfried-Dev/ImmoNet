package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.ConversationResponse;
import com.immoteam.immoteamdev.dto.MessageRequest;
import com.immoteam.immoteamdev.dto.MessageResponse;
import com.immoteam.immoteamdev.entity.Conversation;
import com.immoteam.immoteamdev.entity.Message;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.mapper.MessageMapper;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.ConversationRepository;
import com.immoteam.immoteamdev.repository.MessageRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final BienRepository bienRepository;
    private final MessageMapper messageMapper;

    /**
     * Liste toutes les conversations de l'utilisateur connecté.
     */
    public List<ConversationResponse> getConversations(String userEmail) {
        Utilisateur user = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        return conversationRepository.findByParticipant1IdOrParticipant2IdOrderByDernierMessageAtDesc(user.getId(), user.getId())
                .stream()
                .map(conv -> {
                    // Récupération optimisée du dernier message
                    Message dernierMsg = messageRepository.findTopByConversationIdOrderByDateEnvoiDesc(conv.getId()).orElse(null);
                    String dernierContenu = dernierMsg != null ? dernierMsg.getContenu() : "";
                    int unreadCount = (int) messageRepository.countByConversationIdAndDestinataireIdAndLuFalse(conv.getId(), user.getId());
                    return messageMapper.toConversationResponse(conv, user, dernierContenu, unreadCount);
                })
                .collect(Collectors.toList());
    }

    /**
     * Récupère les messages d'une conversation et les marque comme lus.
     */
    @Transactional
    public List<MessageResponse> getMessages(Long conversationId, String userEmail) {
        Utilisateur user = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation non trouvée"));

        // Vérification de participation
        if (!conv.getParticipant1().getId().equals(user.getId()) && !conv.getParticipant2().getId().equals(user.getId())) {
            throw new IllegalStateException("Vous ne participez pas à cette conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByDateEnvoiAsc(conversationId);

        // Marquer comme lu
        messages.stream()
                .filter(m -> !m.isLu() && m.getDestinataire().getId().equals(user.getId()))
                .forEach(m -> {
                    m.setLu(true);
                    m.setDateLu(LocalDateTime.now());
                });

        return messages.stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Envoie un nouveau message. Initialise une conversation si nécessaire (premier message client).
     */
    @Transactional
    public MessageResponse envoyerMessage(MessageRequest request, String expediteurEmail) {
        Utilisateur expediteur = utilisateurRepository.findByEmail(expediteurEmail)
                .orElseThrow(() -> new IllegalArgumentException("Expéditeur non trouvé"));

        Conversation conv;
        Utilisateur destinataire;

        if (request.getConversationId() != null) {
            // Message dans une conversation existante
            conv = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new IllegalArgumentException("Conversation non trouvée"));

            destinataire = conv.getParticipant1().getId().equals(expediteur.getId())
                    ? conv.getParticipant2()
                    : conv.getParticipant1();
        } else if (request.getBienId() != null) {
            // Premier message d'un client pour un bien : Initialisation de la conversation
            com.immoteam.immoteamdev.entity.Bien bien = bienRepository.findById(request.getBienId())
                    .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé"));

            destinataire = bien.getProprietaire();
            
            if (destinataire.getId().equals(expediteur.getId())) {
                throw new IllegalStateException("Vous ne pouvez pas envoyer un message sur votre propre bien");
            }

            // Vérifier si une conversation existe déjà entre ces deux participants pour ce bien
            conv = conversationRepository.findConversationForBienBetween(bien.getId(), expediteur.getId(), destinataire.getId())
                    .orElseGet(() -> {
                        Conversation newConv = Conversation.builder()
                                .bien(bien)
                                .participant1(expediteur)
                                .participant2(destinataire)
                                .dernierMessageAt(LocalDateTime.now())
                                .build();
                        return conversationRepository.save(newConv);
                    });
        } else {
            throw new IllegalArgumentException("ConversationId ou BienId requis");
        }

        Message message = Message.builder()
                .conversation(conv)
                .expediteur(expediteur)
                .destinataire(destinataire)
                .contenu(request.getContenu())
                .dateEnvoi(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);

        // Mise à jour de la date du dernier message dans la conversation
        conv.setDernierMessageAt(savedMessage.getDateEnvoi());
        conversationRepository.save(conv);

        return messageMapper.toResponse(savedMessage);
    }
}
