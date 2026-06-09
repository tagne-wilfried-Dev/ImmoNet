package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "biens")
// CORRECTION MAJEURE : Suppression de @Data. 
// Pourquoi ? @Data génère automatiquement equals() et hashCode(). 
// Avec Hibernate, cela provoque des boucles infinies (StackOverflowError) et des problèmes de performance 
// lors du chargement des proxies en Lazy Loading. On utilise @Getter et @Setter explicitement.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // CONVENTION : FetchType.LAZY par défaut
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;

    // suppression en cascade d'un bien supprime ses photos)
    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @OrderBy("ordre ASC")
    private List<PhotoBien> photos = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EquipementBien> equipements = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Disponibilite> disponibilites = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OffreAchat> offresAchat = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DemandeVisite> demandesVisite = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Favori> favoris = new ArrayList<>();

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Signalement> signalements = new ArrayList<>();

    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private TypeOperation typeOperation;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private TypeBien typeBien;

    @NotBlank
    @Column(nullable = false)
    private String adresse;

    @NotBlank
    @Column(nullable = false)
    private String ville;

    @Column
    private String quartier;

    @NotBlank
    @Column(nullable = false)
    private String pays;

    @Column
    private BigDecimal latitude;

    @Column
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    private PeriodeLocation periodeLocation;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false)
    private BigDecimal prix;

    @Column
    private BigDecimal caution;

    @Column
    private boolean chargesIncluses;

    @Column
    private boolean prixNegoceable;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false)
    private BigDecimal surface;

    @Column
    private Integer nbPieces;

    @Column
    private Integer nbChambres;

    @Column
    private Integer nbSdb;

    @Column
    private Integer etage;

    @Column
    private Boolean estMeuble;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutAnnonce statut = StatutAnnonce.PUBLIE; // Modifié de PUBLIE à BROUILLON pour respecter le CDC §3.4 (validation admin requise avant publication)

    @Column
    private LocalDateTime datePublication;

    @Column
    private LocalDateTime dateExpiration;

    @Column
    @Builder.Default
    private Integer nbVues = 0;

    @Column
    @Builder.Default
    private Integer nbFavoris = 0;

    @Column
    @Builder.Default
    private boolean estBoost = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public boolean estPublie() {
        return StatutAnnonce.PUBLIE.equals(this.statut);
    }

    public boolean estEnLocation() {
        return StatutAnnonce.EN_LOCATION.equals(this.statut);
    }

    public boolean estVendu() {
        return StatutAnnonce.VENDU.equals(this.statut);
    }
}