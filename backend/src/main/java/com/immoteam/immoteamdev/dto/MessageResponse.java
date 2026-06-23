package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.TypeMessage;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private Long conversationId;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private boolean lu;
    private Long expediteurId;
    private String expediteurEmail;
    private String expediteurNom;
    private TypeMessage typeMessage;
}
