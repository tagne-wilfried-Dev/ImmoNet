package com.immoteam.repository;

import com.immoteam.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    List<Signalement> findByBienIdAndStatut(String statut);
    long countByBienIdAndStatut(String statut);
    List<Signalement> findByStatutOrderByDateSignalementDesc(String statut);
}