package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.OffreAchat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OffreAchatRepository extends JpaRepository<OffreAchat, Long> {
    List<OffreAchat> findByBienIdOrderByDateCreationDesc(Long bienId);
    List<OffreAchat> findByClientUtilisateurIdOrderByDateCreationDesc(Long clientId);
    List<OffreAchat> findByBienIdAndStatut(Long bienId, String statut);
}