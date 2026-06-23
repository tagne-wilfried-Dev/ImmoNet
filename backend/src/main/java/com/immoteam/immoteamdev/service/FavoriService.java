package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.Favori;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.mapper.BienMapper;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.FavoriRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Gestion des biens favoris d'un utilisateur.
 * S'appuie sur l'entité Favori et FavoriRepository déjà présents.
 */
@Service
@RequiredArgsConstructor
public class FavoriService {

    private final FavoriRepository favoriRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final BienRepository bienRepository;
    private final BienMapper bienMapper;

    /** Liste des biens favoris de l'utilisateur (les plus récents d'abord). */
    @Transactional(readOnly = true)
    public List<BienSummaryResponse> getMesFavoris(String email) {
        Utilisateur user = getUtilisateur(email);
        return favoriRepository.findByUtilisateurIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(Favori::getBien)
                .map(bienMapper::toSummaryResponse)
                .toList();
    }

    /** Ids des biens favoris — pour colorer les cœurs côté recherche. */
    @Transactional(readOnly = true)
    public List<Long> getMesFavorisIds(String email) {
        Utilisateur user = getUtilisateur(email);
        return favoriRepository.findByUtilisateurIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(f -> f.getBien().getId())
                .toList();
    }

    /** Ajoute un bien aux favoris. Idempotent : ne crée pas de doublon. */
    @Transactional
    public void ajouter(Long bienId, String email) {
        Utilisateur user = getUtilisateur(email);
        if (favoriRepository.existsByUtilisateurIdAndBienId(user.getId(), bienId)) {
            return;
        }
        Bien bien = bienRepository.findById(bienId)
                .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + bienId));

        Favori favori = Favori.builder()
                .utilisateur(user)
                .bien(bien)
                .build();
        favoriRepository.save(favori);
    }

    /** Retire un bien des favoris. Idempotent : sans effet si absent. */
    @Transactional
    public void retirer(Long bienId, String email) {
        Utilisateur user = getUtilisateur(email);
        favoriRepository.deleteByUtilisateurIdAndBienId(user.getId(), bienId);
    }

    private Utilisateur getUtilisateur(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé : " + email));
    }
}
