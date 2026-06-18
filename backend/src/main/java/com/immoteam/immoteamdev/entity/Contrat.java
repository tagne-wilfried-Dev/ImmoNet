package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.TypeContrat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contrats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @NotBlank
    @Column(nullable = false)
    private String urlPdf;

    @NotBlank
    @Column(nullable = false)
    private String publicIdCloudinary;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private TypeContrat typeContrat;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateGeneration;

    @Column(nullable = false)
    @Builder.Default
    private boolean estSigne = false;

    @Column
    private LocalDateTime dateSignatureClient;

    @Column
    private LocalDateTime dateSignatureProprietaire;

    @Column(nullable = false)
    @Builder.Default
    private boolean signatureElectronique = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}