package com.immoteam.entity;

@Entity @Table(name="conversations")
public class Conversation {
    @Id private String id;
    @ManyToOne @JoinColumn(name="bien_id") private Bien bien;
    @ManyToOne @JoinColumn(name="participant_1_id") private Utilisateur participant1;
    @ManyToOne @JoinColumn(name="participant_2_id") private Utilisateur participant2;
    private LocalDateTime dateCreation;
    private LocalDateTime dernierMessageAt;
    private boolean estArchiveParticipant1;
    private boolean estArchiveParticipant2;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}