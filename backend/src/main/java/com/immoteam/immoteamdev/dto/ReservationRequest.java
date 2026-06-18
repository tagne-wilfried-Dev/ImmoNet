package com.immoteam.immoteamdev.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {
    @NotNull(message = "Le bien est requis")
    private Long bienId;

    @NotNull(message = "La date de début est requise")
    @FutureOrPresent(message = "La date de début doit être dans le présent ou le futur")
    private LocalDateTime dateDebut;

    @NotNull(message = "La date de fin est requise")
    @Future(message = "La date de fin doit être dans le futur")
    private LocalDateTime dateFin;

    private String messageClient;
}
