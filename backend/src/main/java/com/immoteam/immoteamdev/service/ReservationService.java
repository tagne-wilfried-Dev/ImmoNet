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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BienRepository bienRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ReservationMapper reservationMapper;

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
    public ReservationResponse updateStatut(Long id, StatutReservation nouveauStatut, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation non trouvée"));

        Utilisateur demandeur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        // Sécurité : Seul le propriétaire peut accepter/refuser, seul le client peut annuler
        boolean isProprietaire = reservation.getBien().getProprietaire().getId().equals(demandeur.getId());
        boolean isClient = reservation.getClient().getId().equals(demandeur.getId());

        if (nouveauStatut == StatutReservation.CONFIRMEE || nouveauStatut == StatutReservation.REFUSEE) {
            if (!isProprietaire) throw new IllegalStateException("Seul le propriétaire peut valider cette demande");
        } else if (nouveauStatut == StatutReservation.ANNULEE) {
            if (!isClient && !isProprietaire) throw new IllegalStateException("Action non autorisée");
        }

        reservation.setStatut(nouveauStatut);
        if (nouveauStatut == StatutReservation.CONFIRMEE) {
            reservation.setDateConfirmation(LocalDateTime.now());
        } else if (nouveauStatut == StatutReservation.ANNULEE) {
            reservation.setDateAnnulation(LocalDateTime.now());
        }

        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }
}
