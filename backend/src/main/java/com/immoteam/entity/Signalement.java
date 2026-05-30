package com.immoteam.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.immoteam.entity.enums.MotifSignalement;
import com.immoteam.entity.enums.StatutSignalement;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "signalements")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Signalement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @ManyToOne
    @JoinColumn(name = "signalant_id", nullable = false)
    private Utilisateur signalant;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private MotifSignalement motif;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutSignalement statut = StatutSignalement.EN_ATTENTE;

    @Column
    private LocalDateTime dateTraitement;

    @ManyToOne
    @JoinColumn(name = "admin_traitant_id")
    private Utilisateur adminTraitant;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}