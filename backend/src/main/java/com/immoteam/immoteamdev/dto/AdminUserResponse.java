package com.immoteam.immoteamdev.dto;

import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private RoleUtilisateur role;
    private StatutUtilisateur statut;
    private long nbBiens;
    private LocalDateTime dateInscription;
}
