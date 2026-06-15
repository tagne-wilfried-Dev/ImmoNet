package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.FormatAbonnement;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AbonnementSummaryDto {
    private FormatAbonnement typeAbonnement;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private boolean actif;
}
