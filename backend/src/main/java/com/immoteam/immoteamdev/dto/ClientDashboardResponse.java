package com.immoteam.immoteamdev.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Agrégat des données affichées sur le tableau de bord CLIENT.
 * Calculé côté serveur à partir des réservations, visites et conversations
 * du client connecté. Aucun stockage dédié : tout est dérivé de l'existant.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDashboardResponse {

    private Kpis kpis;
    private List<ActivityItem> recentActivity;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Kpis {
        /** Biens en favoris — module Favoris non développé : toujours 0 pour l'instant. */
        private int favoris;
        /** Visites au statut EN_ATTENTE ou CONFIRMEE. */
        private int visitesPlanifiees;
        /** Réservations au statut EN_ATTENTE, CONFIRMEE ou PAYEE. */
        private int reservationsActives;
        /** Somme des messages non lus sur toutes les conversations. */
        private int messagesNonLus;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityItem {
        /** Type métier : "reservation" | "visit" | "message". */
        private String type;
        private String label;
        private String detail;
        /** Date ISO-8601 (le frontend se charge du formatage). */
        private String date;
        /** Statut visuel : "success" | "pending" | "info" | "neutral". */
        private String status;
    }
}
