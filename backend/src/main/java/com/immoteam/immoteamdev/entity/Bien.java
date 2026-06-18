package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import jakarta.persistence.*;
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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id")
    private Utilisateur proprietaire;

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

    @Column
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column
    private TypeOperation typeOperation;

    @Enumerated(EnumType.STRING)
    @Column
    private TypeBien typeBien;

    @Column
    private String adresse;

    @Column
    private String ville;

    @Column
    private String quartier;

    @Column
    private String pays;

    @Column
    private BigDecimal latitude;

    @Column
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    private PeriodeLocation periodeLocation;

    @Column
    private BigDecimal prix;

    @Column
    private BigDecimal caution;

    @Column
    private Boolean chargesIncluses;

    @Column
    private Boolean prixNegoceable;

    @Column
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
    @Column
    @Builder.Default
    private StatutAnnonce statut = StatutAnnonce.PUBLIE;

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
    private Boolean estBoost = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
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
