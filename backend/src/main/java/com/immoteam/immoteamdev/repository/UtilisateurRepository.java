package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // 🔍 CDC 3.1 : Connexion & Vérification unicité
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);

    // 🔍 CDC 2.2 & 3.9 : Gestion des rôles & validation Pro
    long countByRole(String role);
    // Si votre enum Role est typée, remplacez String par com.immoteam.entity.enums.RoleEnum
}