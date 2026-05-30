package com.immoteam.repository;

import com.immoteam.entity.AlerteRecherche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlerteRechercheRepository extends JpaRepository<AlerteRecherche, Long> {
    List<AlerteRecherche> findByUtilisateurIdAndActifTrue(Long utilisateurId);
}