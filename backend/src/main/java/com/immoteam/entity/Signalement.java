package com.immoteam.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.immoteam.entity.enums.MotifSignalement;
import com.immoteam.entity.enums.StatutSignalement;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "signalements")
public class Signalement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id")
    private Bien bien;

    @ManyToOne
    @JoinColumn(name = "signalant_id")
    private Utilisateur signalant;

    @Enumerated(EnumType.STRING)
    private MotifSignalement motif;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private StatutSignalement statut; // EN_ATTENTE, TRAITE, REJETE

    private LocalDateTime dateTraitement;

    @ManyToOne
    @JoinColumn(name = "admin_traitant_id")
    private Utilisateur adminTraitant;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}