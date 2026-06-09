package com.immoteam.immoteamdev.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProprietaireSummaryDTO {
    private Long id;
    private String nom;
    private String prenom;
    private Boolean estPro;
    private String telephone;
}