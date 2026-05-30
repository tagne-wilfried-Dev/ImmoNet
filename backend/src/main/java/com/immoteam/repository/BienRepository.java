package com.immoteam.repository;

import com.immoteam.entity.Bien;
import com.immoteam.entity.enums.StatutAnnonce;
import com.immoteam.entity.enums.TypeBien;
import com.immoteam.entity.enums.TypeOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BienRepository extends JpaRepository<Bien, Long> {
    
    // Recherche avancée avec filtres
    @Query("""
        SELECT b FROM Bien b
        WHERE b.statut = :statut
        AND (:typeOperation IS NULL OR b.typeOperation = :typeOperation)
        AND (:typeBien IS NULL OR b.typeBien = :typeBien)
        AND (:ville IS NULL OR LOWER(b.ville) LIKE LOWER(CONCAT('%', :ville, '%')))
        AND (:prixMin IS NULL OR b.prix >= :prixMin)
        AND (:prixMax IS NULL OR b.prix <= :prixMax)
        AND (:surfaceMin IS NULL OR b.surface >= :surfaceMin)
        AND (:disponibleDu IS NULL OR NOT EXISTS (
            SELECT d FROM Disponibilite d 
            WHERE d.bien = b 
            AND d.statut = 'RESERVE'
            AND d.dateDebut <= :disponibleAu 
            AND d.dateFin >= :disponibleDu
        ))
        ORDER BY b.datePublication DESC
        """)
    Page<Bien> rechercherParCriteres(
        @Param("statut") StatutAnnonce statut,
        @Param("typeOperation") TypeOperation typeOperation,
        @Param("typeBien") TypeBien typeBien,
        @Param("ville") String ville,
        @Param("prixMin") BigDecimal prixMin,
        @Param("prixMax") BigDecimal prixMax,
        @Param("surfaceMin") BigDecimal surfaceMin,
        @Param("disponibleDu") LocalDate disponibleDu,
        @Param("disponibleAu") LocalDate disponibleAu,
        Pageable pageable
    );
    
    // Recherche géographique (Haversine)
    @Query("""
        SELECT b FROM Bien b
        WHERE b.statut = :statut
        AND (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(b.latitude))
                * cos(radians(b.longitude) - radians(:lng))
                + sin(radians(:lat)) * sin(radians(b.latitude))
            )
        ) <= :rayon
        ORDER BY b.datePublication DESC
        """)
    Page<Bien> rechercherParRayon(
        @Param("statut") StatutAnnonce statut,
        @Param("lat") Double lat,
        @Param("lng") Double lng,
        @Param("rayon") Integer rayonKm,
        Pageable pageable
    );
    
    // Annonces d'un propriétaire
    Page<Bien> findByProprietaireIdAndStatut(String proprietaireId, StatutAnnonce statut, Pageable pageable);
    
    // Biens expirés à archiver
    @Query("SELECT b FROM Bien b WHERE b.statut = 'PUBLIE' AND b.dateExpiration IS NOT NULL AND b.dateExpiration < :now")
    List<Bien> findBiensExpirés(@Param("now") LocalDateTime now);
}
