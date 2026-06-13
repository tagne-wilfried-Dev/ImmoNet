package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.AuthResponse;
import com.immoteam.immoteamdev.dto.LoginRequest;
import com.immoteam.immoteamdev.dto.RefreshRequest;
import com.immoteam.immoteamdev.dto.RegisterRequest;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import com.immoteam.immoteamdev.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service qui gère l'authentification, l'inscription et la gestion des tokens.
 */
@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasseHash(passwordEncoder.encode(request.getMotDePasse()))
                .telephone(request.getTelephone())
                .role(request.getRole())
                .build();

        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            UsernamePasswordAuthenticationToken authInputToken =
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse());
            authenticationManager.authenticate(authInputToken);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Email ou mot de passe invalide.");
        }

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));

        String accessToken = jwtUtil.generateAccessToken(utilisateur.getEmail(), utilisateur.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(utilisateur.getEmail());
        utilisateur.setRefreshToken(refreshToken);
        utilisateurRepository.save(utilisateur);

        return new AuthResponse(
                accessToken,
                refreshToken,
                utilisateur.getRole().name(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.isEmailVerifie()
        );
    }

    @Transactional
    public AuthResponse refreshToken(RefreshRequest request) {
        if (!jwtUtil.validateToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token invalide ou expiré.");
        }

        String email = jwtUtil.extractEmail(request.getRefreshToken());
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));

        if (!request.getRefreshToken().equals(utilisateur.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token non reconnu.");
        }

        String newAccessToken = jwtUtil.generateAccessToken(utilisateur.getEmail(), utilisateur.getRole());

        return new AuthResponse(
                newAccessToken,
                utilisateur.getRefreshToken(),
                utilisateur.getRole().name(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.isEmailVerifie()
        );
    }

    @Transactional
    public void logout(RefreshRequest request) {
        utilisateurRepository.findByRefreshToken(request.getRefreshToken())
                .ifPresent(utilisateur -> {
                    utilisateur.setRefreshToken(null);
                    utilisateurRepository.save(utilisateur);
                });
    }
}
