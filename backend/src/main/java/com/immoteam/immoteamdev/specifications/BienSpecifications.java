package com.immoteam.immoteamdev.specifications;

import com.immoteam.immoteamdev.dto.BienFilterRequest;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class BienSpecifications {

    private BienSpecifications() {
        // Classe utilitaire, constructeur privé
    }

    public static Specification<Bien> filterBy(BienFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filtre de sécurité implicite  :
            // Ne retourner que les annonces PUBLIEES par défaut dans la recherche publique.
            // (Le service layer pourra surcharger ce statut si l'utilisateur est le
            // propriétaire ou un admin)
            predicates.add(criteriaBuilder.equal(root.get("statut"), StatutAnnonce.PUBLIE));

            // 2. Filtres textuels (recherche insensible à la casse et partielle)
            if (filter.getVille() != null && !filter.getVille().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("ville")),
                        "%" + filter.getVille().toLowerCase() + "%"));
            }

            if (filter.getQuartier() != null && !filter.getQuartier().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("quartier")),
                        "%" + filter.getQuartier().toLowerCase() + "%"));
            }

            // 3. Filtres énumérés (égalité stricte)
            if (filter.getTypeOperation() != null) {
                predicates.add(criteriaBuilder.equal(root.get("typeOperation"), filter.getTypeOperation()));
            }

            if (filter.getTypeBien() != null) {
                predicates.add(criteriaBuilder.equal(root.get("typeBien"), filter.getTypeBien()));
            }

            // 4. Filtres de fourchette (Prix)
            if (filter.getPrixMin() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("prix"), filter.getPrixMin()));
            }
            if (filter.getPrixMax() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("prix"), filter.getPrixMax()));
            }

            // 5. Filtres de fourchette (Surface)
            if (filter.getSurfaceMin() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("surface"), filter.getSurfaceMin()));
            }
            if (filter.getSurfaceMax() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("surface"), filter.getSurfaceMax()));
            }

            // 6. Filtres discrets
            if (filter.getNbChambres() != null) {
                // Interprétation UX standard : "au moins" ce nombre de chambres
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("nbChambres"), filter.getNbChambres()));
            }

            if (filter.getEstMeuble() != null) {
                predicates.add(criteriaBuilder.equal(root.get("estMeuble"), filter.getEstMeuble()));
            }

            // Combinaison de tous les prédicats avec un AND logique
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}