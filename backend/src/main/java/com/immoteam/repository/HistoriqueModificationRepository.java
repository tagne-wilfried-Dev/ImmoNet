package com.immoteam.repository;

import com.immoteam.entity.HistoriqueModification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoriqueModificationRepository extends JpaRepository<HistoriqueModification, Long> {
    List<HistoriqueModification> findByBienIdOrderByDateModificationDesc(Long bienId);
    List<HistoriqueModification> findByUtilisateurIdOrderByDateModificationDesc(Long utilisateurId);
}