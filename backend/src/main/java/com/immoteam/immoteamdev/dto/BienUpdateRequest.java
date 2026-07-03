package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.PeriodeLocation;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class BienUpdateRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotNull(message = "Le type de bien est obligatoire")
    private TypeBien typeBien;

    @NotNull(message = "Le type d'opération est obligatoire")
    private TypeOperation typeOperation;

    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String quartier;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être supérieur à 0")
    private BigDecimal prix;

    @DecimalMin(value = "0.0", message = "La caution ne peut pas être négative")
    private BigDecimal caution;

    private Boolean chargesIncluses;

    private Boolean prixNegoceable;

    private PeriodeLocation periodeLocation;

    @NotNull(message = "La surface est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "La surface doit être supérieure à 0")
    private BigDecimal surface;

    @Min(value = 0, message = "Le nombre de pièces ne peut pas être négatif")
    private Integer nbPieces;

    @Min(value = 0, message = "Le nombre de chambres ne peut pas être négatif")
    private Integer nbChambres;

    @Min(value = 0, message = "Le nombre de salles de bain ne peut pas être négatif")
    private Integer nbSdb;

    @Min(value = 0, message = "L'étage ne peut pas être négatif")
    private Integer etage;

    private Boolean estMeuble;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    // Note : Le champ 'statut' est volontairement exclu de cette requête.
    // Les changements de statut (ex: passer à VENDU ou ARCHIVE) doivent être
    // gérés par des endpoints dédiés pour plus de traçabilité et de sécurité.
}