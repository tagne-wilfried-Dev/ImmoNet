package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.FormatAbonnement;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
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
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private FormatAbonnement typeAbonnement;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dateDebut;

    @Column
    private LocalDateTime dateFin;

    @Column
    private String stripeSubscriptionId;

    @Column
    private String stripePaymentId;

    @Column(nullable = false)
    @Builder.Default
    private boolean actif = false;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false)
    private BigDecimal montantPaye;

    @NotBlank
    @Column(nullable = false)
    private String devise;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}