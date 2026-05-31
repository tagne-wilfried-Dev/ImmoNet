package com.immoteam.immoteamdev.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token_reinitialisation_mdp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenReinitialisationMdp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false, foreignKey = @ForeignKey(name = "fk_token_reset_user"))
    private Utilisateur utilisateur;

    @Column(name = "date_expiration", nullable = false)
    private LocalDateTime dateExpiration;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "est_utilise", nullable = false)
    @Builder.Default
    private Boolean estUtilise = false;

    /**
     * Vérifie si le token a dépassé sa date d'expiration.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(dateExpiration);
    }
}