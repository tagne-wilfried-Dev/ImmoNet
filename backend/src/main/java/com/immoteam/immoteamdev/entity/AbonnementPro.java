package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.FormatAbonnement;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "abonnements_pro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbonnementPro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id") // Rendu nullable
    private Utilisateur utilisateur;

    @Enumerated(EnumType.STRING)
    @Column // Rendu nullable
    private FormatAbonnement typeAbonnement;

    @Column // Rendu nullable
    private LocalDateTime dateDebut;

    @Column
    private String stripeSubscriptionId;

    @Column
    private String stripePaymentId;

    @Column
    private Boolean actif; // Changé de boolean à Boolean pour accepter null

    @Column
    private BigDecimal montantPaye;

    @Column
    private String devise;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;
}
