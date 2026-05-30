package com.immoteam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import com.immoteam.entity.enums.ModePaiement;
import com.immoteam.entity.enums.StatutPaiement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements_loyers")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaiementLoyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "locataire_id", nullable = false)
    private Locataire locataire;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false)
    private BigDecimal montant;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime datePaiement;

    @Column
    private String moisConcerne;

    @Column(nullable = false)
    private Integer annee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;

    @Column
    private String urlQuittance;

    @Column
    private String publicIdQuittance;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private ModePaiement modePaiement;

    @Column
    private String referencePaiement;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}