package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.StatutReservation;
import com.immoteam.immoteamdev.entity.enums.TypeReservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private Long id;
    private Long bienId;
    private String bienTitre;
    private String bienImage;
    private String bienVille;
    private Long clientId;
    private String clientNomComplet;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private BigDecimal montantTotal;
    private String devise;
    private StatutReservation statut;
    private TypeReservation typeReservation;
    private String messageClient;
    private String motifRefus;
    private LocalDateTime createdAt;
}
