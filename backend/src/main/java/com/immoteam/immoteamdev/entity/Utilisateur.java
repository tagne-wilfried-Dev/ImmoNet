package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;
// import com.immoteam.immoteamdev.entity.Signalement;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    String nom;

    String prenom;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Column(nullable = false)
    String motDePasseHash;

    @NotBlank
    private String telephone;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    LocalDateTime dateInscription;

    @Column
    LocalDateTime dernierLogin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    StatutUtilisateur statut = StatutUtilisateur.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    RoleUtilisateur role = RoleUtilisateur.CLIENT;

    // on va changer apres mettre a true pour faciliter
    @Column(columnDefinition = "boolean default true")
    boolean emailVerifie;

    @Column
    String avatarUrl;

    // date d'acceptation des CGU
    LocalDateTime consentementCguDate;

    @Column
    String resetToken;

    @Column
    String resetTokenExpires;

    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    // les associations
    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Bien> biens = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    private AbonnementPro abonnementPro;

    @Column
    private String refreshToken;
}
