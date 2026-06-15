package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.StatutVisite;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeVisiteResponse {
    private Long id;
    private BienSummaryResponse bien;
    private ProprietaireSummaryDTO client;
    private ProprietaireSummaryDTO proprietaire;
    private LocalDate dateSouhaitee;
    private LocalTime heureSouhaitee;
    private StatutVisite statut;
    private String messageClient;
    private String motifRefus;
    private LocalDateTime createdAt;
}
