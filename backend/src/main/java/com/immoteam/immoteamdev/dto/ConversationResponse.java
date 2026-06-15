package com.immoteam.immoteamdev.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {
    private Long id;
    private Long bienId;
    private String bienTitre;
    private String bienPhotoUrl;
    
    private String interlocuteurNom;
    private String interlocuteurPrenom;
    private String interlocuteurEmail;
    
    private String dernierMessageContenu;
    private LocalDateTime dernierMessageAt;
    private int messagesNonLus;
}
