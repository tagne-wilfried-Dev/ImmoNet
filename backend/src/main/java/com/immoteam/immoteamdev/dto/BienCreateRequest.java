package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BienCreateRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "Le type d'opération est obligatoire")
    private TypeOperation typeOperation;

    @NotNull(message = "Le type de bien est obligatoire")
    private TypeBien typeBien;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String quartier;

    @NotBlank(message = "Le pays est obligatoire")
    private String pays;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private PeriodeLocation periodeLocation;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private BigDecimal prix;

    private BigDecimal caution;

    @Builder.Default
    private boolean chargesIncluses = false;

    @Builder.Default
    private boolean prixNegoceable = false;

    @NotNull(message = "La surface est obligatoire")
    @DecimalMin(value = "0.01", message = "La surface doit être supérieure à 0")
    private BigDecimal surface;

    private Integer nbPieces;
    private Integer nbChambres;
    private Integer nbSdb;
    private Integer etage;

    @Builder.Default
    private boolean estMeuble = false;
}