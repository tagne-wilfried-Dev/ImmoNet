package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.DemandeVisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeVisiteRepository extends JpaRepository<DemandeVisite, Long> {
    List<DemandeVisite> findByBienIdAndStatutOrderByCreatedAtDesc(Long bienId, String statut);
    List<DemandeVisite> findByProprietaireIdAndStatutOrderByCreatedAtDesc(Long proprietaireId, String statut);
    List<DemandeVisite> findByClientIdOrderByCreatedAtDesc(Long clientId);
}