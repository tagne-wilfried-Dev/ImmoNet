package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.DemandeVisite;
import com.immoteam.immoteamdev.entity.enums.StatutVisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeVisiteRepository extends JpaRepository<DemandeVisite, Long> {
    List<DemandeVisite> findByBienIdAndStatutOrderByCreatedAtDesc(Long bienId, StatutVisite statut);
    List<DemandeVisite> findByProprietaireIdAndStatutOrderByCreatedAtDesc(Long proprietaireId, StatutVisite statut);
    List<DemandeVisite> findByProprietaireIdOrderByCreatedAtDesc(Long proprietaireId);
    List<DemandeVisite> findByClientIdOrderByCreatedAtDesc(Long clientId);
}