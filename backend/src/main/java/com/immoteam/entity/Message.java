package com.immoteam.entity;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    private String id;
    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;
    @ManyToOne
    @JoinColumn(name = "expediteur_id")
    private Utilisateur expediteur;
    @Column(columnDefinition = "TEXT")
    private String contenu;
    private LocalDateTime dateEnvoi;
    private boolean estLu;
    private LocalDateTime dateLu;
    @Enumerated(EnumType.STRING)
    private TypeMessage typeMessage; // TEXTE, IMAGE, DOCUMENT
    private String urlFichier;
    @CreationTimestamp
    private LocalDateTime createdAt;
}