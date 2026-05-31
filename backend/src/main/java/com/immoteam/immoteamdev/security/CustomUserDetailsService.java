package com.immoteam.immoteamdev.security;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;

public class CustomUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository = null;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun Utilisateur coorespondant a : " + email));

        if (!StatutUtilisateur.ACTIVE.equals(utilisateur.getStatut())) {
            throw new DisabledException("Compte désactivé");
        }

        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasseHash())
                .roles(utilisateur.getRole().name())
                .disabled(!utilisateur.isEmailVerifie()) // Optionnel : forcer vérification email
                .build();
    }
}
