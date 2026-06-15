package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.DemandeVisiteRequest;
import com.immoteam.immoteamdev.dto.DemandeVisiteResponse;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.DemandeVisite;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutVisite;
import com.immoteam.immoteamdev.mapper.DemandeVisiteMapper;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.DemandeVisiteRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DemandeVisiteService {

    private final DemandeVisiteRepository demandeVisiteRepository;
    private final BienRepository bienRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final DemandeVisiteMapper demandeVisiteMapper;

    @Transactional
    public DemandeVisiteResponse creerDemande(DemandeVisiteRequest request, String clientEmail) {
        // 1. Récupération du client
        Utilisateur client = utilisateurRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé avec l'email : " + clientEmail));

        // 2. Récupération du bien
        Bien bien = bienRepository.findById(request.getBienId())
                .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé avec l'ID : " + request.getBienId()));

        // 3. Règle métier : On ne peut pas demander une visite pour son propre bien
        if (bien.getProprietaire().getId().equals(client.getId())) {
            throw new IllegalStateException("Vous ne pouvez pas demander une visite pour votre propre bien.");
        }

        // 4. Création de la demande
        DemandeVisite demande = demandeVisiteMapper.toEntity(request);
        demande.setBien(bien);
        demande.setClient(client);
        demande.setProprietaire(bien.getProprietaire());
        demande.setStatut(StatutVisite.EN_ATTENTE);

        DemandeVisite savedDemande = demandeVisiteRepository.save(demande);

        return demandeVisiteMapper.toResponse(savedDemande);
    }

    /**
     * Récupère les demandes effectuées par le client connecté.
     */
    public List<DemandeVisiteResponse> getMesDemandesClient(String email) {
        Utilisateur client = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        return demandeVisiteRepository.findByClientIdOrderByCreatedAtDesc(client.getId())
                .stream()
                .map(demandeVisiteMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les demandes reçues par le propriétaire connecté.
     */
    public List<DemandeVisiteResponse> getMesDemandesProprietaire(String email) {
        Utilisateur proprietaire = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        return demandeVisiteRepository.findByProprietaireIdOrderByCreatedAtDesc(proprietaire.getId())
                .stream()
                .map(demandeVisiteMapper::toResponse)
                .collect(Collectors.toList());
    }
}
