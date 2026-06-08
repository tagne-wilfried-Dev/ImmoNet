package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeBien;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BienDetailResponse {
    private Long id;
    private TypeBien typeBien;
    private TypeOperation typeOperation;
    private StatutAnnonce statut;
    
    private String ville;
    private String quartier;
    private Double prix;
    private Double surface;
    private Integer nbChambres;
    private Boolean estMeuble;
    private String description;
    
    private List<String> urlsPhotos;
    private ProprietaireSummaryDTO proprietaire;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}