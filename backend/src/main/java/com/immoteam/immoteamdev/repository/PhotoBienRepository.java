package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.PhotoBien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhotoBienRepository extends JpaRepository<PhotoBien, Long> {
    List<PhotoBien> findByBienIdOrderByOrdreAsc(Long bienId);
    // Optional<PhotoBien> findByBienIdAndPrincipaleTrue(Long bienId);
    int countByBienId(Long bienId);
    void deleteByBienId(Long bienId);
}