package com.immoteam.immoteamdev.mapper;

import com.immoteam.immoteamdev.dto.ReservationRequest;
import com.immoteam.immoteamdev.dto.ReservationResponse;
import com.immoteam.immoteamdev.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public Reservation toEntity(ReservationRequest request) {
        if (request == null) return null;
        return Reservation.builder()
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .messageClient(request.getMessageClient())
                .build();
    }

    public ReservationResponse toResponse(Reservation entity) {
        if (entity == null) return null;
        
        String bienImage = entity.getBien().getPhotos() != null && !entity.getBien().getPhotos().isEmpty()
                ? entity.getBien().getPhotos().get(0).getUrlCloudinary()
                : null;

        return ReservationResponse.builder()
                .id(entity.getId())
                .bienId(entity.getBien().getId())
                .bienTitre(entity.getBien().getTitre())
                .bienImage(bienImage)
                .bienVille(entity.getBien().getVille())
                .clientId(entity.getClient().getId())
                .clientNomComplet(entity.getClient().getPrenom() + " " + entity.getClient().getNom())
                .dateDebut(entity.getDateDebut())
                .dateFin(entity.getDateFin())
                .montantTotal(entity.getMontantTotal())
                .devise(entity.getDevise())
                .statut(entity.getStatut())
                .typeReservation(entity.getTypeReservation())
                .messageClient(entity.getMessageClient())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
