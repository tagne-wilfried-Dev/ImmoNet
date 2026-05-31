package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.HistoriqueModification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoriqueModificationRepository extends JpaRepository<HistoriqueModification, Long> {
    List<HistoriqueModification> findByUtilisateurIdOrderByDateModificationDesc(Long utilisateurId);
}