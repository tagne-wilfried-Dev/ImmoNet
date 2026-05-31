package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Signalement;
import com.immoteam.immoteamdev.entity.enums.StatutSignalement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    List<Signalement> findByBienIdAndStatut(Long BienId,String statut);
    long countByBienIdAndStatut(Long BienId,String statut);
    List<Signalement> findByStatutOrderByCreatedAtDesc(StatutSignalement statut);
}