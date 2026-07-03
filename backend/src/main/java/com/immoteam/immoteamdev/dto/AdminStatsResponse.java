package com.immoteam.immoteamdev.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

/**
 * Agrégats réels pour le tableau de bord administrateur.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {

    // Utilisateurs
    private long totalUtilisateurs;
    private long totalClients;
    private long totalPros;
    private long totalAdmins;

    // Biens
    private long totalBiens;
    private long biensPublies;
    private Map<String, Long> biensParStatut;

    // Abonnements (par formule)
    private Map<String, Long> abonnementsParPlan;

    // Modération
    private long signalementsActifs;

    // Dernières inscriptions (pour le widget "Utilisateurs récents")
    private List<AdminUserResponse> utilisateursRecents;
}
