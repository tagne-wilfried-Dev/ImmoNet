package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.DemandeVisiteRequest;
import com.immoteam.immoteamdev.dto.DemandeVisiteResponse;
import com.immoteam.immoteamdev.service.DemandeVisiteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visites")
@RequiredArgsConstructor
@Tag(name = "Demandes de Visite", description = "Gestion des mises en relation clients/propriétaires")
public class DemandeVisiteController {

    private final DemandeVisiteService demandeVisiteService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'PRO', 'ADMIN')")
    @Operation(summary = "Demander une visite", description = "Crée une nouvelle demande de visite pour un bien.")
    public ResponseEntity<DemandeVisiteResponse> demanderVisite(
            @Valid @RequestBody DemandeVisiteRequest request,
            Authentication authentication) {
        
        DemandeVisiteResponse response = demandeVisiteService.creerDemande(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/client")
    @PreAuthorize("hasAnyRole('CLIENT', 'PRO', 'ADMIN')")
    @Operation(summary = "Mes demandes envoyées", description = "Liste les demandes de visite faites par l'utilisateur connecté.")
    public ResponseEntity<List<DemandeVisiteResponse>> getMesDemandesEnvoyees(Authentication authentication) {
        return ResponseEntity.ok(demandeVisiteService.getMesDemandesClient(authentication.getName()));
    }

    @GetMapping("/proprietaire")
    @PreAuthorize("hasAnyRole('PRO', 'ADMIN')")
    @Operation(summary = "Mes demandes reçues", description = "Liste les demandes de visite reçues par le propriétaire connecté.")
    public ResponseEntity<List<DemandeVisiteResponse>> getMesDemandesRecues(Authentication authentication) {
        return ResponseEntity.ok(demandeVisiteService.getMesDemandesProprietaire(authentication.getName()));
    }
}
