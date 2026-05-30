package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.AbonnementPro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AbonnementProRepository extends JpaRepository<AbonnementPro, Long> {
    Optional<AbonnementPro> findByUtilisateurId(Long utilisateurId);
    Optional<AbonnementPro> findByStripeSubId(String stripeSubId);
    boolean existsByUtilisateurIdAndActifTrueAndValideParAdminTrue(Long utilisateurId);
}