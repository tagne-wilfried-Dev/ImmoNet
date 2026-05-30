package com.immoteam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "photos_biens")
public class PhotoBien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id")
    private Bien bien;

    private String urlCloudinary;

    private String publicIdCloudinary;

    private int ordre;

    private boolean estPrincipale;

    @CreationTimestamp
    private LocalDateTime createdAt;
}