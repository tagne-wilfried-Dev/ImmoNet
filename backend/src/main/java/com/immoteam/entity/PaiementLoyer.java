package com.immoteam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.immoteam.entity.enums.ModePaiement;
import com.immoteam.entity.enums.StatutPaiement;

@Entity
@Table(name = "paiements_loyers")
public class PaiementLoyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "locataire_id")
    private Locataire locataire;
    private BigDecimal montant;
    private LocalDateTime datePaiement;
    private String moisConcerne; // Format "YYYY-MM"
    private int annee;
    @Enumerated(EnumType.STRING)
    private StatutPaiement statut; // PAYE, EN_RETARD, EN_ATTENTE
    private String urlQuittance;
    private String publicIdQuittance;
    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement; // STRIPE, MOMO, ORANGE_MONEY, ESPECE, VIREMENT
    private String referencePaiement;
    private String commentaire;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}