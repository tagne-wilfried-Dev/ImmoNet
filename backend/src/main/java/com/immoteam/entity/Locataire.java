package com.immoteam.entity;

@Entity
@Table(name = "locataires")
public class Locataire {
    @Id
    private String id;
    @ManyToOne
    @JoinColumn(name = "bien_id")
    private Bien bien;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Utilisateur client;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    private LocalDate dateFinPrevue;
    private BigDecimal montantLoyer;
    private int jourEcheance; // 1-31
    @Enumerated(EnumType.STRING)
    private StatutLocataire statut; // ACTIF, ANCIEN, EN_RETARD
    @OneToOne
    @JoinColumn(name = "contrat_id")
    private Contrat contrat;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}