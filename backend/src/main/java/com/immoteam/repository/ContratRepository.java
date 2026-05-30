package com.immoteam.repository;

import com.immoteam.entity.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {
    Optional<Contrat> findByReservationId(Long reservationId);
    Optional<Contrat> findByUrlPdf(String urlPdf);
}