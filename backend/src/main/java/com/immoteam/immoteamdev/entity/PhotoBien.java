package com.immoteam.immoteamdev.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos_biens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoBien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @NotBlank
    @Column(nullable = false)
    private String urlCloudinary;

    @NotBlank
    @Column(nullable = false)
    private String publicIdCloudinary;

    @Column(nullable = false)
    @Builder.Default
    private Integer ordre = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean estPrincipale = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}