package com.immoteam.repository;

import com.immoteam.entity.DemandeVisite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeVisiteRepository extends JpaRepository<DemandeVisite, Long> {
    List<DemandeVisite> findByBienIdAndStatutOrderByDateDemandeDesc(Long bienId, String statut);
    List<DemandeVisite> findByProprietaireUtilisateurIdAndStatutOrderByDateDemandeDesc(Long proprietaireId, String statut);
    List<DemandeVisite> findByClientUtilisateurIdOrderByDateDemandeDesc(Long clientId);
}