package com.immoteam.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.immoteam.entity.enums.FormatAbonnement;

import jakarta.persistence.*;

@Entity 
@Table(name="abonnements_pro")
public class AbonnementPro {
    @Id 
    private Long id;

    @ManyToOne 
    @JoinColumn(name="utilisateur_id") 
    private Utilisateur utilisateur;

    @Enumerated(EnumType.STRING) 
    private FormatAbonnement typeAbonnement;

    private LocalDateTime dateDebut;

    private LocalDateTime dateFin;

    private String stripeSubscriptionId;

    private String stripePaymentId;

    private boolean actif; // TRUE via webhook Stripe après paiement

    private BigDecimal montantPaye;

    private String devise;

    @CreationTimestamp 
    private LocalDateTime createdAt;
    
    @UpdateTimestamp 
    private LocalDateTime updatedAt;
}