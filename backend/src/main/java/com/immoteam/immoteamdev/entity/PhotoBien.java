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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bien_id", nullable = false)
    private Bien bien;

    @NotBlank
    @Column
    private String urlCloudinary;

    @NotBlank
    @Column
    private String publicIdCloudinary;

    @Column
    @Builder.Default
    private Integer ordre = 0;

    @Column
    @Builder.Default
    private boolean estPrincipale = false;

    @CreationTimestamp
    @Column
    private LocalDateTime createdAt;
}