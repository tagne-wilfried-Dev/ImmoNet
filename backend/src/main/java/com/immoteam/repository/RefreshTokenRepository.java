package com.immoteam.repository;

import com.immoteam.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
    boolean existsByToken(String token);

    // 🔄 CDC 8.1 : Invalidation à la déconnexion ou changement de mot de passe
    void deleteByUtilisateurId(Long utilisateurId);

    // 🧹 Nettoyage automatique des tokens expirés (ex: via @Scheduled)
    long deleteByExpirationDateBefore(LocalDateTime date);
}