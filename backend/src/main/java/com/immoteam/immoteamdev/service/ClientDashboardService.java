package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.ClientDashboardResponse;
import com.immoteam.immoteamdev.dto.ConversationResponse;
import com.immoteam.immoteamdev.dto.DemandeVisiteResponse;
import com.immoteam.immoteamdev.dto.ReservationResponse;
import com.immoteam.immoteamdev.entity.enums.StatutReservation;
import com.immoteam.immoteamdev.entity.enums.StatutVisite;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Construit l'agrégat du tableau de bord CLIENT en réutilisant les services
 * métier existants. Aucune requête directe : tout est dérivé des réponses
 * déjà exposées par ReservationService, DemandeVisiteService et MessageService.
 */
@Service
@RequiredArgsConstructor
public class ClientDashboardService {

    private static final int MAX_ACTIVITY = 6;

    private static final Set<StatutReservation> RESERVATIONS_ACTIVES = EnumSet.of(
            StatutReservation.EN_ATTENTE,
            StatutReservation.CONFIRMEE,
            StatutReservation.PAYEE);

    private static final Set<StatutVisite> VISITES_PLANIFIEES = EnumSet.of(
            StatutVisite.EN_ATTENTE,
            StatutVisite.CONFIRMEE);

    private final ReservationService reservationService;
    private final DemandeVisiteService demandeVisiteService;
    private final MessageService messageService;
    private final FavoriService favoriService;

    public ClientDashboardResponse getDashboard(String email) {
        List<ReservationResponse> reservations = reservationService.getReservationsClient(email);
        List<DemandeVisiteResponse> visites = demandeVisiteService.getMesDemandesClient(email);
        List<ConversationResponse> conversations = messageService.getConversations(email);

        ClientDashboardResponse.Kpis kpis = ClientDashboardResponse.Kpis.builder()
                .favoris(favoriService.getMesFavorisIds(email).size())
                .visitesPlanifiees((int) visites.stream()
                        .filter(v -> VISITES_PLANIFIEES.contains(v.getStatut()))
                        .count())
                .reservationsActives((int) reservations.stream()
                        .filter(r -> RESERVATIONS_ACTIVES.contains(r.getStatut()))
                        .count())
                .messagesNonLus(conversations.stream()
                        .mapToInt(ConversationResponse::getMessagesNonLus)
                        .sum())
                .build();

        List<ClientDashboardResponse.ActivityItem> activity = buildActivity(reservations, visites, conversations);

        return ClientDashboardResponse.builder()
                .kpis(kpis)
                .recentActivity(activity)
                .build();
    }

    /**
     * Fusionne réservations, visites et conversations en un flux d'activité
     * trié par date décroissante, limité à MAX_ACTIVITY entrées.
     */
    private List<ClientDashboardResponse.ActivityItem> buildActivity(
            List<ReservationResponse> reservations,
            List<DemandeVisiteResponse> visites,
            List<ConversationResponse> conversations) {

        List<DatedActivity> items = new ArrayList<>();

        for (ReservationResponse r : reservations) {
            String detail = r.getBienTitre()
                    + (r.getBienVille() != null ? " – " + r.getBienVille() : "");
            items.add(new DatedActivity(
                    r.getCreatedAt(),
                    ClientDashboardResponse.ActivityItem.builder()
                            .type("reservation")
                            .label("Réservation " + libelleStatutReservation(r.getStatut()))
                            .detail(detail)
                            .date(toIso(r.getCreatedAt()))
                            .status(statusVisuelReservation(r.getStatut()))
                            .build()));
        }

        for (DemandeVisiteResponse v : visites) {
            String titre = v.getBien() != null ? v.getBien().getTitre() : "Bien";
            String ville = v.getBien() != null ? v.getBien().getVille() : null;
            String detail = titre + (ville != null ? " – " + ville : "");
            items.add(new DatedActivity(
                    v.getCreatedAt(),
                    ClientDashboardResponse.ActivityItem.builder()
                            .type("visit")
                            .label("Visite " + libelleStatutVisite(v.getStatut()))
                            .detail(detail)
                            .date(toIso(v.getCreatedAt()))
                            .status(statusVisuelVisite(v.getStatut()))
                            .build()));
        }

        for (ConversationResponse c : conversations) {
            String interlocuteur = ((c.getInterlocuteurPrenom() != null ? c.getInterlocuteurPrenom() + " " : "")
                    + (c.getInterlocuteurNom() != null ? c.getInterlocuteurNom() : "")).trim();
            String detail = c.getBienTitre() != null ? c.getBienTitre() : "";
            if (!interlocuteur.isEmpty()) {
                detail = "Propriétaire : " + interlocuteur;
            }
            items.add(new DatedActivity(
                    c.getDernierMessageAt(),
                    ClientDashboardResponse.ActivityItem.builder()
                            .type("message")
                            .label(c.getMessagesNonLus() > 0 ? "Nouveau message" : "Conversation")
                            .detail(detail)
                            .date(toIso(c.getDernierMessageAt()))
                            .status("info")
                            .build()));
        }

        return items.stream()
                .sorted(Comparator.comparing(
                        DatedActivity::date,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(MAX_ACTIVITY)
                .map(DatedActivity::item)
                .collect(Collectors.toList());
    }

    private String toIso(LocalDateTime dt) {
        return dt != null ? dt.toString() : null;
    }

    // ─── Libellés & statuts visuels ──────────────────────────────────────────

    private String libelleStatutReservation(StatutReservation s) {
        return switch (s) {
            case EN_ATTENTE -> "en attente";
            case CONFIRMEE -> "confirmée";
            case PAYEE -> "payée";
            case TERMINEE -> "terminée";
            case REFUSEE -> "refusée";
            case ANNULEE -> "annulée";
        };
    }

    private String statusVisuelReservation(StatutReservation s) {
        return switch (s) {
            case CONFIRMEE, PAYEE, TERMINEE -> "success";
            case EN_ATTENTE -> "pending";
            case REFUSEE, ANNULEE -> "neutral";
        };
    }

    private String libelleStatutVisite(StatutVisite s) {
        return switch (s) {
            case EN_ATTENTE -> "demandée";
            case CONFIRMEE -> "planifiée";
            case REALISEE -> "réalisée";
            case REFUSEE -> "refusée";
            case ANNULEE -> "annulée";
        };
    }

    private String statusVisuelVisite(StatutVisite s) {
        return switch (s) {
            case CONFIRMEE, REALISEE -> "success";
            case EN_ATTENTE -> "pending";
            case REFUSEE, ANNULEE -> "neutral";
        };
    }

    /** Couple (date de tri, item construit) pour ordonner le flux d'activité. */
    private record DatedActivity(LocalDateTime date, ClientDashboardResponse.ActivityItem item) {
    }
}
