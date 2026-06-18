package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByClientIdOrderByCreatedAtDesc(Long clientId);
    
    @Query("SELECT r FROM Reservation r JOIN r.bien b WHERE b.proprietaire.id = :proprietaireId ORDER BY r.createdAt DESC")
    List<Reservation> findByProprietaireId(@Param("proprietaireId") Long proprietaireId);
    
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.bien.id = :bienId " +
           "AND r.statut NOT IN (com.immoteam.immoteamdev.entity.enums.StatutReservation.ANNULEE, com.immoteam.immoteamdev.entity.enums.StatutReservation.REFUSEE) " +
           "AND (:dateDebut < r.dateFin AND :dateFin > r.dateDebut)")
    boolean existsOverlappingReservation(@Param("bienId") Long bienId, 
                                          @Param("dateDebut") LocalDateTime dateDebut, 
                                          @Param("dateFin") LocalDateTime dateFin);
}
