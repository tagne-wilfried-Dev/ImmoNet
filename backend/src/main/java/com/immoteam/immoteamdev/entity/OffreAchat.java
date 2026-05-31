package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.StatutOffre;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "offres_achat")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OffreAchat {
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
    @DecimalMin("0.01")
    @Column(nullable = false)
    private BigDecimal montantPropose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutOffre statut = StatutOffre.SOUMISE;

    @Column(columnDefinition = "TEXT")
    private String message;

    @DecimalMin("0.01")
    @Column
    private BigDecimal contreProposition;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dateSoumission;

    @Column
    private LocalDateTime dateReponse;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}