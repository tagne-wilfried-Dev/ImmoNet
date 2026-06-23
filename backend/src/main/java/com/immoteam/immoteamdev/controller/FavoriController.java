package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.service.FavoriService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favoris")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CLIENT', 'PRO', 'ADMIN')")
@Tag(name = "Favoris", description = "Biens favoris de l'utilisateur connecté")
public class FavoriController {

    private final FavoriService favoriService;

    @GetMapping
    @Operation(summary = "Lister mes biens favoris")
    public ResponseEntity<List<BienSummaryResponse>> getMesFavoris(Authentication authentication) {
        return ResponseEntity.ok(favoriService.getMesFavoris(authentication.getName()));
    }

    @GetMapping("/ids")
    @Operation(summary = "Lister les ids de mes biens favoris", description = "Utile pour colorer les cœurs dans les listes de recherche.")
    public ResponseEntity<List<Long>> getMesFavorisIds(Authentication authentication) {
        return ResponseEntity.ok(favoriService.getMesFavorisIds(authentication.getName()));
    }

    @PostMapping("/{bienId}")
    @Operation(summary = "Ajouter un bien aux favoris")
    public ResponseEntity<Void> ajouter(@PathVariable Long bienId, Authentication authentication) {
        favoriService.ajouter(bienId, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{bienId}")
    @Operation(summary = "Retirer un bien des favoris")
    public ResponseEntity<Void> retirer(@PathVariable Long bienId, Authentication authentication) {
        favoriService.retirer(bienId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
