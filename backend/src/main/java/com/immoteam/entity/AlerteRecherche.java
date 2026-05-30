@Entity @Table(name="alertes_recherche")
public class AlerteRecherche {
    @Id private String id;
    @ManyToOne @JoinColumn(name="utilisateur_id") private Utilisateur utilisateur;
    private String nomAlerte;
    private String ville;
    @Enumerated(EnumType.STRING) private TypeOperation typeOperation;
    private String typeBien;
    private BigDecimal prixMin;
    private BigDecimal prixMax;
    private BigDecimal surfaceMin;
    private BigDecimal surfaceMax;
    private boolean estActive;
    private LocalDateTime derniereNotification;
    @CreationTimestamp private LocalDateTime createdAt;
}