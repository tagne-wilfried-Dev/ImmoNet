package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.BienCreateRequest;
import com.immoteam.immoteamdev.dto.BienDetailResponse;
import com.immoteam.immoteamdev.dto.BienFilterRequest;
import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.dto.BienUpdateRequest;
import com.immoteam.immoteamdev.service.BienService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biens")
@RequiredArgsConstructor
@Tag(name = "Biens Immobiliers", description = "Gestion et recherche des annonces immobilières")
public class BienController {

    private final BienService bienService;

    @GetMapping
    @Operation(summary = "Rechercher des biens", description = "Retourne une liste paginée de biens correspondant aux filtres. Accès public.")
    @ApiResponse(responseCode = "200", description = "Succès", content = @Content(schema = @Schema(implementation = BienSummaryResponse.class)))
    public ResponseEntity<Page<BienSummaryResponse>> rechercher(
            @ModelAttribute @Valid BienFilterRequest filter,
            @Parameter(description = "Numéro de page (commence à 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page (max 50)") @RequestParam(defaultValue = "20") int size) {
        
        // Sécurité : limiter la taille de page pour éviter les attaques DOS (CDC §8.2)
        int safeSize = Math.min(size, 50);
        
        Page<BienSummaryResponse> resultats = bienService.rechercherBiens(filter, page, safeSize);
        return ResponseEntity.ok(resultats);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PRO', 'ADMIN')") // CDC §3.1 : Seuls les Pros et Admins peuvent créer
    @Operation(summary = "Créer une annonce", description = "Crée une nouvelle annonce au statut BROUILLON. Nécessite un rôle PRO ou ADMIN.")
    @ApiResponse(responseCode = "201", description = "Annonce créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "401", description = "Non authentifié")
    @ApiResponse(responseCode = "403", description = "Non autorisé (rôle insuffisant)")
    public ResponseEntity<BienSummaryResponse> creerBien(
            @Valid @RequestBody BienCreateRequest request,
            Authentication authentication) {
        
        // Récupération de l'email de l'utilisateur authentifié via Spring Security
        String userEmail = authentication.getName();
        
        BienSummaryResponse bienCree = bienService.creerBien(request, userEmail);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(bienCree);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'une annonce", description = "Accessible publiquement si PUBLIE, sinon réservé au propriétaire ou ADMIN")
    public ResponseEntity<BienDetailResponse> getDetail(@PathVariable Long id) {
        BienDetailResponse response = bienService.getDetailById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRO', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Modifier une annonce", description = "Réservé au propriétaire du bien ou à un ADMIN. Ne modifie pas le statut ni les photos.")
    public ResponseEntity<BienDetailResponse> updateBien(
            @PathVariable Long id,
            @Valid @RequestBody BienUpdateRequest request) {
        
        BienDetailResponse response = bienService.updateBien(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRO', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Archiver une annonce (Soft Delete)", description = "Passe le statut à ARCHIVE. Réservé au propriétaire ou ADMIN.")
    public ResponseEntity<Void> archiverBien(@PathVariable Long id) {
        bienService.archiverBien(id);
        return ResponseEntity.noContent().build(); // 204 No Content est la norme pour un DELETE réussi
    }
}