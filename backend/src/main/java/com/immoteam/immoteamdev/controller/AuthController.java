package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.AuthResponse;
import com.immoteam.immoteamdev.dto.LoginRequest;
import com.immoteam.immoteamdev.dto.RefreshRequest;
import com.immoteam.immoteamdev.dto.RegisterRequest;
import com.immoteam.immoteamdev.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contrôleur d'authentification qui expose les endpoints publics.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
//    Endpoint pour l'inscription d'un nouvel utilisateur
    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }
//    Endpoint pour l'authentification d'un utilisateur et la génération d'un token JWT
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
//    Endpoint pour rafraîchir le token JWT à l'aide d'un refresh token
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }
//    Endpoint pour déconnecter un utilisateur en invalidant son refresh token
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }
}
