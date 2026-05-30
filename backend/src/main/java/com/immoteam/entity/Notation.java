package com.immoteam.entity;

@Entity
@Table(name = "notations")
public class Notation {
    @Id
    private String id;
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
    @ManyToOne
    @JoinColumn(name = "bien_id")
    private Bien bien;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Utilisateur client;
    @ManyToOne
    @JoinColumn(name = "proprietaire_id")
    private Utilisateur proprietaire;
    @Min(1)
    @Max(5)
    private Integer noteClientPourProprietaire;
    @Min(1)
    @Max(5)
    private Integer noteProprietairePourClient;
    @Column(columnDefinition = "TEXT")
    private String commentaireClient;
    @Column(columnDefinition = "TEXT")
    private String commentaireProprietaire;
    private LocalDateTime dateCreation;
    @Enumerated(EnumType.STRING)
    private TypeOperation typeOperation;
    @CreationTimestamp
    private LocalDateTime createdAt;
}