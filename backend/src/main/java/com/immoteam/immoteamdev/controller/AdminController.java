package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.AdminBienResponse;
import com.immoteam.immoteamdev.dto.AdminStatsResponse;
import com.immoteam.immoteamdev.dto.AdminUserResponse;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;
import com.immoteam.immoteamdev.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Administration", description = "Tableau de bord, gestion des utilisateurs et modération des biens (ADMIN)")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "Statistiques plateforme", description = "Agrégats réels : utilisateurs, biens par statut, abonnements, signalements.")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ─── Utilisateurs ─────────────────────────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "Lister tous les utilisateurs")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/statut")
    @Operation(summary = "Changer le statut d'un utilisateur", description = "ACTIVE / SUSPENDED / BANNED. Interdit sur un compte ADMIN.")
    public ResponseEntity<AdminUserResponse> updateUserStatut(
            @PathVariable Long id,
            @RequestParam StatutUtilisateur statut) {
        return ResponseEntity.ok(adminService.updateUserStatut(id, statut));
    }

    // ─── Biens ────────────────────────────────────────────────────────────────

    @GetMapping("/biens")
    @Operation(summary = "Lister tous les biens", description = "Tous les biens de la plateforme, tous propriétaires confondus.")
    public ResponseEntity<List<AdminBienResponse>> getAllBiens() {
        return ResponseEntity.ok(adminService.getAllBiens());
    }

    @PatchMapping("/biens/{id}/statut")
    @Operation(summary = "Modérer un bien", description = "L'admin peut suspendre / republier / archiver n'importe quel bien.")
    public ResponseEntity<AdminBienResponse> updateBienStatut(
            @PathVariable Long id,
            @RequestParam StatutAnnonce statut) {
        return ResponseEntity.ok(adminService.updateBienStatut(id, statut));
    }
}
