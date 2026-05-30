package com.immoteam.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    private String tokenHash; // Hash du token, jamais stocké en clair
    private LocalDateTime dateExpiration;
    private boolean estRevoque;
    private LocalDateTime dateRevocation;
    private String ipCreation;
    @Column(columnDefinition = "TEXT")
    private String userAgent;
    @CreationTimestamp
    private LocalDateTime createdAt;
}