package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.ReservationRequest;
import com.immoteam.immoteamdev.dto.ReservationResponse;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.Reservation;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutReservation;
import com.immoteam.immoteamdev.entity.enums.TypeReservation;
import com.immoteam.immoteamdev.mapper.ReservationMapper;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.ReservationRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BienRepository bienRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ReservationMapper reservationMapper;

    /**
     * Transitions autorisées du cycle de vie d'une réservation.
     * EN_ATTENTE → CONFIRMEE / REFUSEE / ANNULEE
     * CONFIRMEE  → PAYEE / ANNULEE
     * PAYEE      → TERMINEE / ANNULEE
     * REFUSEE / ANNULEE / TERMINEE : états terminaux.
     */
    private static final Map<StatutReservation, EnumSet<StatutReservation>> TRANSITIONS_AUTORISEES =
            new EnumMap<>(StatutReservation.class);

    static {
        TRANSITIONS_AUTORISEES.put(StatutReservation.EN_ATTENTE,
                EnumSet.of(StatutReservation.CONFIRMEE, StatutReservation.REFUSEE, StatutReservation.ANNULEE));
        TRANSITIONS_AUTORISEES.put(StatutReservation.CONFIRMEE,
                EnumSet.of(StatutReservation.PAYEE, StatutReservation.ANNULEE));
        TRANSITIONS_AUTORISEES.put(StatutReservation.PAYEE,
                EnumSet.of(StatutReservation.TERMINEE, StatutReservation.ANNULEE));
        TRANSITIONS_AUTORISEES.put(StatutReservation.REFUSEE, EnumSet.noneOf(StatutReservation.class));
        TRANSITIONS_AUTORISEES.put(StatutReservation.ANNULEE, EnumSet.noneOf(StatutReservation.class));
        TRANSITIONS_AUTORISEES.put(StatutReservation.TERMINEE, EnumSet.noneOf(StatutReservation.class));
    }

    @Transactional
    public ReservationResponse creerDemande(ReservationRequest request, String userEmail) {
        Utilisateur client = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Bien bien = bienRepository.findById(request.getBienId())
                .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé"));

        // Vérification de disponibilité
        if (reservationRepository.existsOverlappingReservation(bien.getId(), request.getDateDebut(), request.getDateFin())) {
            throw new IllegalStateException("Ce bien est déjà réservé pour ces dates");
        }

        // Calcul du montant (Basé sur le prix journalier, on simplifie pour la démo)
        long jours = Duration.between(request.getDateDebut(), request.getDateFin()).toDays();
        if (jours <= 0) jours = 1;
        BigDecimal montantTotal = bien.getPrix().multiply(new BigDecimal(jours));

        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setBien(bien);
        reservation.setClient(client);
        reservation.setMontantTotal(montantTotal);
        reservation.setDevise("XAF");
        reservation.setTypeReservation(TypeReservation.LOCATION);
        reservation.setStatut(StatutReservation.EN_ATTENTE);

        Reservation saved = reservationRepository.save(reservation);
        return reservationMapper.toResponse(saved);
    }

    public List<ReservationResponse> getReservationsClient(String email) {
        Utilisateur client = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        return reservationRepository.findByClientIdOrderByCreatedAtDesc(client.getId())
                .stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsProprietaire(String email) {
        Utilisateur proprietaire = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        return reservationRepository.findByProprietaireId(proprietaire.getId())
                .stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse updateStatut(Long id, StatutReservation nouveauStatut, String motif, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

        Utilisateur demandeur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        boolean isProprietaire = reservation.getBien().getProprietaire().getId().equals(demandeur.getId());
        boolean isClient = reservation.getClient().getId().equals(demandeur.getId());
        if (!isProprietaire && !isClient) {
            throw new IllegalStateException("Action non autorisée sur cette réservation");
        }

        // 1) La transition doit être autorisée par le cycle de vie
        StatutReservation statutActuel = reservation.getStatut();
        if (!TRANSITIONS_AUTORISEES.getOrDefault(statutActuel, EnumSet.noneOf(StatutReservation.class))
                .contains(nouveauStatut)) {
            throw new IllegalStateException(
                    "Transition impossible : " + statutActuel + " → " + nouveauStatut);
        }

        // 2) Autorisation par rôle selon l'action demandée
        switch (nouveauStatut) {
            case CONFIRMEE, REFUSEE, TERMINEE -> {
                if (!isProprietaire) {
                    throw new IllegalStateException("Seul le propriétaire peut effectuer cette action");
                }
            }
            case PAYEE -> {
                if (!isClient) {
                    throw new IllegalStateException("Seul le client peut payer la réservation");
                }
            }
            case ANNULEE -> { /* client ou propriétaire : déjà validé ci-dessus */ }
            default -> { /* aucun autre statut cible possible ici */ }
        }

        // 3) Application du nouveau statut + effets de bord (timestamps, paiement simulé…)
        reservation.setStatut(nouveauStatut);
        switch (nouveauStatut) {
            case CONFIRMEE -> reservation.setDateConfirmation(LocalDateTime.now());
            case REFUSEE -> {
                reservation.setMotifRefus(
                        motif != null && !motif.isBlank() ? motif : "Demande refusée par le propriétaire");
                reservation.setDateAnnulation(LocalDateTime.now());
            }
            case ANNULEE -> reservation.setDateAnnulation(LocalDateTime.now());
            case PAYEE -> reservation.setStripePaymentStatus("SIMULATED"); // démo : pas de Stripe réel
            case TERMINEE -> { /* fin du séjour, aucun effet supplémentaire */ }
            default -> { }
        }

        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }
}
