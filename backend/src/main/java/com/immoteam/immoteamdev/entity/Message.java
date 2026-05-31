package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.TypeMessage;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Utilisateur expediteur;

    @ManyToOne
    @JoinColumn(name = "destinataire_id", nullable = false)
    private Utilisateur destinataire;

    @NotBlank(message = "Le contenu du message est obligatoire")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dateEnvoi;

    @Column(nullable = false)
    @Builder.Default
    private boolean lu = false;

    @Column
    private LocalDateTime dateLu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TypeMessage typeMessage = TypeMessage.TEXTE;

    @Column
    private String urlFichier;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}