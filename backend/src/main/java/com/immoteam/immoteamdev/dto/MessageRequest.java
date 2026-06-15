package com.immoteam.immoteamdev.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private Long conversationId; // Optionnel pour le premier message

    private Long bienId;         // Requis pour initialiser une conversation

    @NotBlank(message = "Le contenu du message ne peut pas être vide")
    private String contenu;
}
