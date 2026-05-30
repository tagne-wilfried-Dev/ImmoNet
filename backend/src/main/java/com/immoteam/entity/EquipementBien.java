package com.immoteam.entity;

@Entity @Table(name="equipements")
public class EquipementBien {
    @Id private String id;
    @ManyToOne @JoinColumn(name="bien_id") private Bien bien;
    private String nom;
    @Enumerated(EnumType.STRING) private CategorieEquipement categorie;
    @CreationTimestamp private LocalDateTime createdAt;
}