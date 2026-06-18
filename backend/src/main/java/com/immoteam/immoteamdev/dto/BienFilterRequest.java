package com.immoteam.immoteamdev.dto;

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
public class BienFilterRequest {

    // Filtres textuels ( Recherche par lieu)
    private String ville;
    private String quartier;

    // Filtres énumérés
    private TypeOperation typeOperation;
    private TypeBien typeBien;

    // Filtres numériques (Fourchettes)
    private BigDecimal prixMin;
    private BigDecimal prixMax;
    private BigDecimal surfaceMin;
    private BigDecimal surfaceMax;

    // Filtres discrets
    private Integer nbChambres; // "Au moins X chambres"
    private Boolean estMeuble;  // true = meublé, false = non meublé, null = peu importe
}