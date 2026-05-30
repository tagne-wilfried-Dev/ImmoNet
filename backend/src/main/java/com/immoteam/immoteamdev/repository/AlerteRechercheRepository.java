package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.AlerteRecherche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlerteRechercheRepository extends JpaRepository<AlerteRecherche, Long> {
    List<AlerteRecherche> findByUtilisateurIdAndEstActifTrue(Long utilisateurId);
}