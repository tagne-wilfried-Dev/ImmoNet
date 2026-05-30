@Entity
@Table(name = "offres_achat")
public class OffreAchat {
    @Id
    private String id;
    @ManyToOne
    @JoinColumn(name = "bien_id")
    private Bien bien;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Utilisateur client;
    private BigDecimal montantPropose;
    @Enumerated(EnumType.STRING)
    private StatutOffre statut; // SOUMISE, ACCEPTEE, REFUSEE, CONTRE_PROPOSITION, ANNULEE
    @Column(columnDefinition = "TEXT")
    private String message;
    private BigDecimal contreProposition;
    private LocalDateTime dateSoumission;
    private LocalDateTime dateReponse;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}