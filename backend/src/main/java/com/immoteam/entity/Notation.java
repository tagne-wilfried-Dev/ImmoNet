package com.immoteam.entity;

import com.immoteam.entity.enums.TypeOperation;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notations")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;

    @ManyToOne
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;

    @Min(1)
    @Max(5)
    @Column
    private Integer noteClientPourProprietaire;

    @Min(1)
    @Max(5)
    @Column
    private Integer noteProprietairePourClient;

    @Column(columnDefinition = "TEXT")
    private String commentaireClient;

    @Column(columnDefinition = "TEXT")
    private String commentaireProprietaire;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeOperation typeOperation;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}