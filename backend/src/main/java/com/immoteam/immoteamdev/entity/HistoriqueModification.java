package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.ActionModification;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historique_modifications")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriqueModification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @NotBlank
    @Column(nullable = false)
    private String tableConcernee;

    @NotBlank
    @Column(nullable = false)
    private String enregistrementId;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private ActionModification action;

    @Column(columnDefinition = "JSON")
    private String anciennesValeurs;

    @Column(columnDefinition = "JSON")
    private String nouvellesValeurs;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateModification;

    @Column
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;
}