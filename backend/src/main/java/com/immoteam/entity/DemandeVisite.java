@Entity @Table(name="demandes_visite")
public class DemandeVisite {
    @Id private String id;
    @ManyToOne @JoinColumn(name="bien_id") private Bien bien;
    @ManyToOne @JoinColumn(name="client_id") private Utilisateur client;
    private LocalDate dateSouhaitee;
    private LocalTime heureSouhaitee;
    @Enumerated(EnumType.STRING) private StatutVisite statut; // EN_ATTENTE, CONFIRMEE, REFUSEE, ANNULEE, REALISEE
    @Column(columnDefinition="TEXT") private String messageClient;
    @Column(columnDefinition="TEXT") private String motifRefus;
    private LocalDateTime dateConfirmation;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}