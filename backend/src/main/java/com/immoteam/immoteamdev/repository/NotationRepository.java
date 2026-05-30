package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Notation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotationRepository extends JpaRepository<Notation, Long> {
    List<Notation> findByReservationId(Long reservationId);
    
    @Query("SELECT AVG(n.note) FROM Notation n WHERE n.bien.id = :bienId")
    Double findAverageNoteByBienId(Long bienId);
    
    long countByBienId(Long bienId);
}