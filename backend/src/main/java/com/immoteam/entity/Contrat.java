package com.immoteam.entity;

@Entity @Table(name="contrats")
public class Contrat {
    @Id private String id;
    @OneToOne @JoinColumn(name="reservation_id") private Reservation reservation;
    private String urlPdf;
    private String publicIdCloudinary;
    @Enumerated(EnumType.STRING) private TypeContrat typeContrat; // LOCATION, VENTE
    private LocalDateTime dateGeneration;
    private boolean estSigne;
    private LocalDateTime dateSignatureClient;
    private LocalDateTime dateSignatureProprietaire;
    private boolean signatureElectronique;
    @CreationTimestamp private LocalDateTime createdAt;
}