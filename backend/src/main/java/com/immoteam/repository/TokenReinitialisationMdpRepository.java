package com.immoteam.repository;

import com.immoteam.entity.TokenReinitialisationMdp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenReinitialisationMdpRepository extends JpaRepository<TokenReinitialisationMdp, Long> {

    Optional<TokenReinitialisationMdp> findByToken(String token);
    boolean existsByToken(String token);

    void deleteByUtilisateurId(Long utilisateurId);
    long deleteByExpirationDateBefore(LocalDateTime date);
}