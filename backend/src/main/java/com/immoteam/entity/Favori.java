package com.immoteam.entity;

@Entity @Table(name="favoris")
public class Favori {
    @Id private String id;
    @ManyToOne @JoinColumn(name="utilisateur_id") private Utilisateur utilisateur;
    @ManyToOne @JoinColumn(name="bien_id") private Bien bien;
    @CreationTimestamp private LocalDateTime createdAt;
    
    // Contrainte unique : un utilisateur ne peut favoriser un bien qu'une fois
    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"utilisateur_id", "bien_id"}))
}