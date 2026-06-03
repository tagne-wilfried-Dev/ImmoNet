package com.immoteam.immoteamdev.dto;

import java.time.LocalDateTime;

import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;

// import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
// import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    // private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private RoleUtilisateur role;
    private StatutUtilisateur statut;
    private boolean emailVerifie;
    // private String avatarUrl;
    private LocalDateTime dernierLogin;
    private LocalDateTime dateInscription;
}