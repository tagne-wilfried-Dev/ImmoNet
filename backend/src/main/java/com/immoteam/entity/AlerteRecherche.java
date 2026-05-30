package com.immoteam.entity;

import com.immoteam.entity.enums.TypeOperation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertes_recherche")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlerteRecherche {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @NotBlank(message = "Le nom de l'alerte est obligatoire")
    @Column(nullable = false)
    private String nomAlerte;

    @NotBlank
    @Column(nullable = false)
    private String ville;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeOperation typeOperation;

    @Column
    private String typeBien;

    @Column
    private BigDecimal prixMin;

    @Column
    private BigDecimal prixMax;

    @Column
    private BigDecimal surfaceMin;

    @Column
    private BigDecimal surfaceMax;

    @Column(nullable = false)
    @Builder.Default
    private boolean estActive = true;

    @Column
    private LocalDateTime derniereNotification;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}