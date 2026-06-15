package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BienSummaryResponse {

    private Long id;
    private String titre;
    private BigDecimal prix;
    private String ville;
    private String quartier;
    private TypeBien typeBien;
    private TypeOperation typeOperation;
    
    // Champ calculé par le Mapper à partir de la liste des photos
    private String urlPhotoPrincipale;
    
    private BigDecimal surface;
    private Integer nbChambres;
    private Integer nbVues;
    private StatutAnnonce statut;
    private BigDecimal latitude;
    private BigDecimal longitude;
}