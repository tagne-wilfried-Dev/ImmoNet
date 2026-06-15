package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.entity.AbonnementPro;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.FormatAbonnement;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.repository.AbonnementProRepository;
import com.immoteam.immoteamdev.repository.BienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AbonnementService {

    private final AbonnementProRepository abonnementProRepository;
    private final BienRepository bienRepository;

    private static final Map<FormatAbonnement, Integer> QUOTAS = Map.of(
            FormatAbonnement.GRATUIT, 3,
            FormatAbonnement.STARTER, 10,
            FormatAbonnement.BUSINESS, 20,
            FormatAbonnement.PREMIUM, 40
    );

    /**
     * Vérifie si l'utilisateur peut publier une nouvelle annonce.
     */
    public boolean peutPublier(Utilisateur utilisateur) {
        AbonnementPro abonnement = getOrCreateDefaultAbonnement(utilisateur);
        
        if (!abonnement.isActif() && abonnement.getTypeAbonnement() != FormatAbonnement.GRATUIT) {
            return false;
        }

        long count = bienRepository.countByProprietaireIdAndStatut(utilisateur.getId(), StatutAnnonce.PUBLIE);
        return count < QUOTAS.getOrDefault(abonnement.getTypeAbonnement(), 0);
    }

    /**
     * Récupère l'abonnement actuel ou en crée un GRATUIT par défaut.
     */
    @Transactional
    public AbonnementPro getOrCreateDefaultAbonnement(Utilisateur utilisateur) {
        return abonnementProRepository.findByUtilisateurId(utilisateur.getId())
                .orElseGet(() -> {
                    AbonnementPro defaultAbo = AbonnementPro.builder()
                            .utilisateur(utilisateur)
                            .typeAbonnement(FormatAbonnement.GRATUIT)
                            .dateDebut(LocalDateTime.now())
                            .actif(true)
                            .montantPaye(BigDecimal.ZERO)
                            .devise("XOF")
                            .build();
                    return abonnementProRepository.save(defaultAbo);
                });
    }

    public Integer getQuotaRestant(Utilisateur utilisateur) {
        AbonnementPro abonnement = getOrCreateDefaultAbonnement(utilisateur);
        long count = bienRepository.countByProprietaireIdAndStatut(utilisateur.getId(), StatutAnnonce.PUBLIE);
        int max = QUOTAS.getOrDefault(abonnement.getTypeAbonnement(), 0);
        return Math.max(0, max - (int) count);
    }
}
