package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BienDetailResponse {
    private Long id;
    private String titre;
    private TypeBien typeBien;
    private TypeOperation typeOperation;
    private StatutAnnonce statut;
    
    private String description;
    private String adresse;
    private String ville;
    private String quartier;
    private String pays;
    private BigDecimal latitude;
    private BigDecimal longitude;
    
    private BigDecimal prix;
    private BigDecimal caution;
    private boolean chargesIncluses;
    private boolean prixNegoceable;
    private PeriodeLocation periodeLocation;
    
    private BigDecimal surface;
    private Integer nbPieces;
    private Integer nbChambres;
    private Integer nbSdb;
    private Integer etage;
    private Boolean estMeuble;
    
    private List<String> urlsPhotos;
    private List<String> equipements;
    private ProprietaireSummaryDTO proprietaire;
    
    private Integer nbVues;
    private Integer nbFavoris;
    private boolean estBoost;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}