package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Disponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {
    List<Disponibilite> findByBienId(Long bienId);

    @Query("SELECT d FROM Disponibilite d WHERE d.bien.id = :bienId " +
           "AND (d.dateDebut BETWEEN :start AND :end " +
           "OR d.dateFin BETWEEN :start AND :end " +
           "OR (d.dateDebut <= :start AND d.dateFin >= :end))")
    List<Disponibilite> findOverlappingPeriods(@Param("bienId") Long bienId,
                                               @Param("start") LocalDate start,
                                               @Param("end") LocalDate end);
}