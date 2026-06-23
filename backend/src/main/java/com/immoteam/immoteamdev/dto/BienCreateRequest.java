package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BienCreateRequest {

    private String titre;
    private String description;
    private TypeOperation typeOperation;
    private TypeBien typeBien;
    private String adresse;
    private String ville;
    private String quartier;
    private String pays;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private PeriodeLocation periodeLocation;
    private BigDecimal prix;
    private BigDecimal caution;

    @Builder.Default
    private boolean chargesIncluses = false;

    @Builder.Default
    private boolean prixNegoceable = false;

    private BigDecimal surface;
    private Integer nbPieces;
    private Integer nbChambres;
    private Integer nbSdb;
    private Integer etage;

    @Builder.Default
    private boolean estMeuble = false;
}
