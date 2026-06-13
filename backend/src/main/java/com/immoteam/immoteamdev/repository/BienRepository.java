package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface BienRepository extends JpaRepository<Bien, Long>, JpaSpecificationExecutor<Bien> {

    // 🔍 CDC §3.4 : Vérification du quota d'annonces actives par propriétaire Pro
    long countByProprietaireIdAndStatut(Long proprietaireId, StatutAnnonce statut);

    // 🔍 CDC §3.3 & §3.8 : Validation rapide avant affichage fiche détaillée
    boolean existsByIdAndStatut(Long id, StatutAnnonce statut);

    Page<Bien> findByProprietaireIdAndStatutNot(Long proprietaireId, StatutAnnonce statut, Pageable pageable);

    List<Bien> findByProprietaireIdAndStatutIn(Long proprietaireId, Collection<StatutAnnonce> statuts);
}