package com.immoteam.immoteamdev.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.immoteam.immoteamdev.dto.UpdateProfileRequest;
import com.immoteam.immoteamdev.dto.UserDto;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.exception.ResourceNotFoundException;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto getCurrentUser(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));

        return mapToDto(utilisateur);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));

        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setTelephone(request.getTelephone());

        return mapToDto(utilisateurRepository.save(utilisateur));
    }

    @Transactional
    public void changePassword(String email, String ancienMotDePasse, String nouveauMotDePasse) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));

        if (!passwordEncoder.matches(ancienMotDePasse, utilisateur.getMotDePasseHash())) {
            throw new IllegalArgumentException("L'ancien mot de passe est incorrect.");
        }

        utilisateur.setMotDePasseHash(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(utilisateur);
    }

    public void forgotPassword(String email, String nouveauMotDePasse) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));


        utilisateur.setMotDePasseHash(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(utilisateur);
    }

    private UserDto mapToDto(Utilisateur utilisateur) {
        UserDto dto = new UserDto();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setRole(utilisateur.getRole());
        dto.setStatut(utilisateur.getStatut());
        dto.setDateInscription(utilisateur.getDateInscription());
        dto.setEmailVerifie(utilisateur.isEmailVerifie());
        dto.setAvatarUrl(utilisateur.getAvatarUrl());
        dto.setDernierLogin(utilisateur.getDernierLogin());

        if (utilisateur.getAbonnementPro() != null) {
            dto.setAbonnement(com.immoteam.immoteamdev.dto.AbonnementSummaryDto.builder()
                    .typeAbonnement(utilisateur.getAbonnementPro().getTypeAbonnement())
                    .dateDebut(utilisateur.getAbonnementPro().getDateDebut())
                    .actif(Boolean.TRUE.equals(utilisateur.getAbonnementPro().getActif()))
                    .build());
        }

        return dto;
    }
}
