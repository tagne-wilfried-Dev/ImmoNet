package com.immoteam.entity;

import com.immoteam.entity.enums.StatutLocataire;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "locataires")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Locataire {
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
    private LocalDate dateEntree;

    @Column
    private LocalDate dateSortie;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateFinPrevue;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false)
    private BigDecimal montantLoyer;

    @NotNull
    @Min(1)
    @Max(31)
    @Column(nullable = false)
    private Integer jourEcheance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutLocataire statut = StatutLocataire.ACTIF;

    @OneToOne
    @JoinColumn(name = "contrat_id")
    private Contrat contrat;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}