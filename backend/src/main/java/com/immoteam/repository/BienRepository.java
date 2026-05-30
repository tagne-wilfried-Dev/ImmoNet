// 🔍 CDC §3.4 : Vérification du quota d'annonces actives par propriétaire Pro
    long countByProprietaireIdAndStatut(Long proprietaireId, StatutAnnonce statut);

    // 🔍 CDC §3.3 & §3.8 : Validation rapide avant affichage fiche détaillée
    boolean existsByIdAndStatut(Long id, StatutAnnonce statut);