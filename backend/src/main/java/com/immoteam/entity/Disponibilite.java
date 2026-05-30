package com.immoteam.entity;

@Entity @Table(name="disponibilites")
public class Disponibilite {
    @Id private String id;
    @ManyToOne @JoinColumn(name="bien_id") private Bien bien;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    @Enumerated(EnumType.STRING) private StatutDisponibilite statut; // DISPONIBLE, RESERVE, INDISPONIBLE
    @CreationTimestamp private LocalDateTime createdAt;
}