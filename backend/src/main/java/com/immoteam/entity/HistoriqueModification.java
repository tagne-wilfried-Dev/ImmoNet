@Entity
@Table(name = "historique_modifications")
public class HistoriqueModification {
    @Id
    private String id;
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
    private String tableConcernee;
    private String enregistrementId;
    @Enumerated(EnumType.STRING)
    private ActionModification action; // CREATE, UPDATE, DELETE
    @Column(columnDefinition = "JSON")
    private String anciennesValeurs;
    @Column(columnDefinition = "JSON")
    private String nouvellesValeurs;
    private LocalDateTime dateModification;
    private String ipAddress;
    @Column(columnDefinition = "TEXT")
    private String userAgent;
}