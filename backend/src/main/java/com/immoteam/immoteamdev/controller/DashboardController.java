package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.ClientDashboardResponse;
import com.immoteam.immoteamdev.service.ClientDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Tableau de bord", description = "Agrégats pour les espaces personnels")
public class DashboardController {

    private final ClientDashboardService clientDashboardService;

    @GetMapping("/client")
    @PreAuthorize("hasAnyRole('CLIENT', 'PRO', 'ADMIN')")
    @Operation(summary = "Agrégats du tableau de bord CLIENT",
            description = "Retourne les KPIs (favoris, visites, réservations, messages) et l'activité récente du client connecté.")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard(Authentication authentication) {
        return ResponseEntity.ok(clientDashboardService.getDashboard(authentication.getName()));
    }
}
