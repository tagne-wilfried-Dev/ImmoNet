package com.immoteam.repository;

import com.immoteam.entity.Favori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long> {
    List<Favori> findByUtilisateurIdOrderByDateAjoutDesc(Long utilisateurId);
    Optional<Favori> findByUtilisateurIdAndBienId(Long utilisateurId, Long bienId);
    boolean existsByUtilisateurIdAndBienId(Long utilisateurId, Long bienId);
    void deleteByUtilisateurIdAndBienId(Long utilisateurId, Long bienId);
}