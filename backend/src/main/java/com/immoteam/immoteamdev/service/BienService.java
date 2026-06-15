package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.BienCreateRequest;
import com.immoteam.immoteamdev.dto.BienDetailResponse;
import com.immoteam.immoteamdev.dto.BienFilterRequest;
import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.dto.BienUpdateRequest;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.PhotoBien;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.TypeOperation;
import com.immoteam.immoteamdev.mapper.BienMapper;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.PhotoBienRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import com.immoteam.immoteamdev.specifications.BienSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimisation : toutes les méthodes sont en lecture seule par défaut
public class BienService {

    private final BienRepository bienRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PhotoBienRepository photoBienRepository;
    private final BienMapper bienMapper;
    private final StorageService storageService;
    private final AbonnementService abonnementService;

    /**
     * Recherche multicritère avec pagination (CDC §3.3)
     * @param filter Les critères de recherche (peut être nul ou partiel)
     * @param page Numéro de page (0-indexed)
     * @param size Taille de la page (défaut 20)
     * @return Page de BienSummaryResponse
     */
    public Page<BienSummaryResponse> rechercherBiens(BienFilterRequest filter, int page, int size) {
        // CDC §3.3 : Tri par date de création décroissante par défaut
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        // Si le filtre est nul, on crée un filtre vide pour que la specification retourne tout (sauf la contrainte de statut)
        BienFilterRequest safeFilter = filter != null ? filter : new BienFilterRequest();
        
        Specification<Bien> spec = BienSpecifications.filterBy(safeFilter);
        
        return bienRepository.findAll(spec, pageable).map(bienMapper::toSummaryResponse);
    }

    /**
     * Création d'une nouvelle annonce par un propriétaire (CDC §3.4)
     * @param request Les données de l'annonce
     * @param userEmail L'email de l'utilisateur authentifié (extrait du SecurityContext)
     * @return Le DTO de résumé de l'annonce créée
     */
    @Transactional // Nécessaire pour les opérations d'écriture et l'initialisation des collections @Builder.Default
    public BienSummaryResponse creerBien(BienCreateRequest request, String userEmail) {
        // 1. Récupération du propriétaire
        Utilisateur proprietaire = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'email : " + userEmail));

        // 2. Initialisation auto d'un abonnement GRATUIT si inexistant
        abonnementService.getOrCreateDefaultAbonnement(proprietaire);

        // 3. Mapping et application des règles métier
        Bien nouveauBien = bienMapper.toEntity(request);
        nouveauBien.setProprietaire(proprietaire);
        
        // CDC §3.4 : Une annonce est créée avec le statut BROUILLON en attendant la validation
        nouveauBien.setStatut(StatutAnnonce.BROUILLON);
        
        // Initialisation des compteurs (déjà géré par @Builder.Default, mais explicite pour la clarté)
        nouveauBien.setNbVues(0);
        nouveauBien.setNbFavoris(0);

        // 4. Sauvegarde
        Bien bienSauvegarde = bienRepository.save(nouveauBien);

        return bienMapper.toSummaryResponse(bienSauvegarde);
    }

    /**
     * Ajoute des photos à un bien existant.
     * @param bienId L'ID du bien
     * @param files Liste des fichiers images
     * @return Liste des URLs des photos ajoutées
     */
    @Transactional
    public List<String> ajouterPhotos(Long bienId, List<MultipartFile> files) {
        Bien bien = bienRepository.findById(bienId)
                .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé avec l'ID : " + bienId));

        List<String> urls = new ArrayList<>();
        int currentCount = photoBienRepository.countByBienId(bienId);

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String url = storageService.saveFile(file);
            
            PhotoBien photo = PhotoBien.builder()
                    .bien(bien)
                    .urlCloudinary(url)
                    .publicIdCloudinary("local_" + bienId + "_" + System.currentTimeMillis() + "_" + i)
                    .ordre(currentCount + i)
                    .estPrincipale(currentCount == 0 && i == 0) // La toute première photo devient principale par défaut
                    .build();
            
            photoBienRepository.save(photo);
            urls.add(url);
        }

        return urls;
    }

    public BienDetailResponse getDetailById(Long id) {
        // 1. Récupération du bien (Hibernate chargera le propriétaire et les photos en LAZY si appelés par le mapper)
        Bien bien = bienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun bien trouvé avec l'ID : " + id));

        // 2. Récupération du contexte de sécurité actuel
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        
        // 3. Règle de sécurité stricte : Visible par TOUS uniquement si PUBLIE
        if (bien.getStatut() != StatutAnnonce.PUBLIE) {
            if (!isAuthenticated) {
                throw new AccessDeniedException("Accès refusé : Cette annonce n'est pas publiée.");
            }

            // Vérification des droits pour les statuts non publiés (BROUILLON, SUSPENDU, etc.)
            String currentUsername = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
            
            // On suppose que l'entité Bien a un getter getProprietaire() qui retourne un Utilisateur
            boolean isOwner = bien.getProprietaire().getEmail().equals(currentUsername);

            if (!isOwner && !isAdmin) {
                throw new AccessDeniedException("Accès refusé : Vous n'êtes pas le propriétaire de cette annonce.");
            }
        }

        // 4. Mapping et retour
        return bienMapper.toDetailResponse(bien);
    }

    @Transactional
    public BienDetailResponse updateBien(Long id, BienUpdateRequest request) {
        // 1. Récupération du bien
        Bien bien = bienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun bien trouvé avec l'ID : " + id));

        // RÈGLE MÉTIER : Un bien archivé (ex: vendu) ne peut plus être modifié
        if (bien.getStatut() == StatutAnnonce.ARCHIVE) {
            throw new IllegalStateException("Impossible de modifier un bien archivé ou vendu.");
        }

        // 2. Vérification de sécurité : Propriétaire ou ADMIN uniquement
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Utilisateur non authentifié.");
        }

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        
        boolean isOwner = bien.getProprietaire().getEmail().equals(currentUsername);

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Accès refusé : Vous n'êtes pas le propriétaire de cette annonce.");
        }

        // 3. Application des modifications via MapStruct
        bienMapper.updateBienFromRequest(request, bien);

        // 4. Sauvegarde et retour du DTO mis à jour
        // Note : Si tu utilises JPA Auditing (@LastModifiedDate), le champ updatedAt se mettra à jour automatiquement.
        Bien savedBien = bienRepository.save(bien);
        
        return bienMapper.toDetailResponse(savedBien);
    }

    @Transactional
    public void archiverBien(Long id) {
        Bien bien = bienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aucun bien trouvé avec l'ID : " + id));

        // Vérification de sécurité : Propriétaire ou ADMIN uniquement
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Utilisateur non authentifié.");
        }

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        
        boolean isOwner = bien.getProprietaire().getEmail().equals(currentUsername);

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Accès refusé : Vous n'êtes pas autorisé à archiver cette annonce.");
        }

        // Passage au statut ARCHIVE (Soft Delete)
        bien.setStatut(StatutAnnonce.ARCHIVE);
        bienRepository.save(bien);
    }

    /**
     * Change le statut d'un bien selon les règles métier (Vendu -> Archivage définitif)
     */
    @Transactional
    public BienDetailResponse updateStatut(Long id, StatutAnnonce nouveauStatut, String userEmail) {
        Bien bien = bienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé"));

        // Vérification propriétaire
        if (!bien.getProprietaire().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à modifier ce bien.");
        }

        // Vérification Quota si passage au statut PUBLIE
        if (nouveauStatut == StatutAnnonce.PUBLIE && !abonnementService.peutPublier(bien.getProprietaire())) {
            throw new IllegalStateException("Quota d'annonces publié atteint pour votre abonnement actuel.");
        }

        // RÈGLE MÉTIER : VENTE -> VENDU -> ARCHIVE (Fin de vie)
        if (bien.getTypeOperation() == TypeOperation.VENTE && nouveauStatut == StatutAnnonce.VENDU) {
            bien.setStatut(StatutAnnonce.ARCHIVE);
        } 
        // RÈGLE MÉTIER : LOCATION -> EN_LOCATION (Reste accessible au proprio)
        else {
            bien.setStatut(nouveauStatut);
        }

        return bienMapper.toDetailResponse(bienRepository.save(bien));
    }

    /**
     * Récupère les biens du propriétaire connecté (hors archivés/vendus)
     */
    public Page<BienSummaryResponse> getMesBiens(String userEmail, Pageable pageable) {
        Utilisateur proprietaire = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        // On retourne tout SAUF les archivés (qui incluent les biens vendus)
        return bienRepository.findByProprietaireIdAndStatutNot(proprietaire.getId(), StatutAnnonce.ARCHIVE, pageable)
                .map(bienMapper::toSummaryResponse);
    }

    /**
     * Récupère uniquement les biens actuellement PUBLIE du propriétaire.
     */
    public Page<BienSummaryResponse> getMesAnnonces(String userEmail, Pageable pageable) {
        Utilisateur proprietaire = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        return bienRepository.findAll(
                Specification.where((root, query, cb) -> 
                    cb.and(
                        cb.equal(root.get("proprietaire").get("id"), proprietaire.getId()),
                        cb.equal(root.get("statut"), StatutAnnonce.PUBLIE)
                    )
                ), 
                pageable
        ).map(bienMapper::toSummaryResponse);
    }

    /**
     * Récupère les biens publiables (Brouillon, Loué, Suspendu) du propriétaire.
     */
    public List<BienSummaryResponse> getMesBiensDisponibles(String userEmail) {
        Utilisateur proprietaire = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        List<StatutAnnonce> statutsPubliables = Arrays.asList(
                StatutAnnonce.BROUILLON, 
                StatutAnnonce.EN_LOCATION, 
                StatutAnnonce.SUSPENDU
        );

        return bienRepository.findByProprietaireIdAndStatutIn(proprietaire.getId(), statutsPubliables)
                .stream()
                .map(bienMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }
}