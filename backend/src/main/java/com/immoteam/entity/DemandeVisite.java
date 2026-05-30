package com.immoteam.entity;

import com.immoteam.entity.enums.StatutVisite;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_visite")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeVisite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateSouhaitee;

    @NotNull
    @Column(nullable = false)
    private LocalTime heureSouhaitee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutVisite statut = StatutVisite.EN_ATTENTE;

    @Column(columnDefinition = "TEXT")
    private String messageClient;

    @Column(columnDefinition = "TEXT")
    private String motifRefus;

    @Column
    private LocalDateTime dateConfirmation;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}