package com.immoteam.immoteamdev.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_1_id", nullable = false)
    private Utilisateur participant1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_2_id", nullable = false)
    private Utilisateur participant2;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column
    private LocalDateTime dernierMessageAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean estArchiveParticipant1 = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean estArchiveParticipant2 = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}