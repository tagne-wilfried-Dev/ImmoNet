package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.ReservationRequest;
import com.immoteam.immoteamdev.dto.ReservationResponse;
import com.immoteam.immoteamdev.entity.enums.StatutReservation;
import com.immoteam.immoteamdev.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Réservations", description = "Gestion des séjours et réservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @Operation(summary = "Créer une nouvelle demande de réservation")
    public ResponseEntity<ReservationResponse> creerDemande(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.creerDemande(request, authentication.getName()));
    }

    @GetMapping("/client")
    @Operation(summary = "Lister mes réservations (en tant que client)")
    public ResponseEntity<List<ReservationResponse>> getMesReservations(Authentication authentication) {
        return ResponseEntity.ok(reservationService.getReservationsClient(authentication.getName()));
    }

    @GetMapping("/proprietaire")
    @Operation(summary = "Lister les réservations reçues (en tant que propriétaire)")
    public ResponseEntity<List<ReservationResponse>> getReservationsRecues(Authentication authentication) {
        return ResponseEntity.ok(reservationService.getReservationsProprietaire(authentication.getName()));
    }

    @PatchMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une réservation (Accepter/Refuser/Annuler)")
    public ResponseEntity<ReservationResponse> updateStatut(
            @PathVariable Long id,
            @RequestParam StatutReservation statut,
            Authentication authentication) {
        return ResponseEntity.ok(reservationService.updateStatut(id, statut, authentication.getName()));
    }
}
