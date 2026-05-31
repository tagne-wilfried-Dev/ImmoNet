package com.immoteam.immoteamdev.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse{
    String accessToken;
    String refreshToken;
    String role;
    String nom;
    String prenom;
    String email;
    boolean emailVerifie;
}