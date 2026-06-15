package com.immoteam.immoteamdev.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeVisiteRequest {
    @NotNull(message = "L'identifiant du bien est obligatoire")
    private Long bienId;

    @NotNull(message = "La date souhaitée est obligatoire")
    private LocalDate dateSouhaitee;

    @NotNull(message = "L'heure souhaitée est obligatoire")
    private LocalTime heureSouhaitee;

    private String messageClient;
}
