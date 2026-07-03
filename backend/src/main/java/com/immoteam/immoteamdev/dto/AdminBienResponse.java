package com.immoteam.immoteamdev.dto;

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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBienResponse {
    private Long id;
    private String titre;
    private TypeBien typeBien;
    private TypeOperation typeOperation;
    private StatutAnnonce statut;
    private BigDecimal prix;
    private String ville;
    private String urlPhotoPrincipale;

    // Propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;

    private LocalDateTime createdAt;
}
