package com.immoteam.immoteamdev.service;

import com.immoteam.immoteamdev.dto.AdminBienResponse;
import com.immoteam.immoteamdev.dto.AdminStatsResponse;
import com.immoteam.immoteamdev.dto.AdminUserResponse;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.PhotoBien;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;
import com.immoteam.immoteamdev.entity.enums.StatutAnnonce;
import com.immoteam.immoteamdev.entity.enums.StatutSignalement;
import com.immoteam.immoteamdev.entity.enums.StatutUtilisateur;
import com.immoteam.immoteamdev.repository.AbonnementProRepository;
import com.immoteam.immoteamdev.repository.BienRepository;
import com.immoteam.immoteamdev.repository.SignalementRepository;
import com.immoteam.immoteamdev.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final BienRepository bienRepository;
    private final AbonnementProRepository abonnementProRepository;
    private final SignalementRepository signalementRepository;

    /**
     * Agrégats réels pour le tableau de bord admin.
     */
    public AdminStatsResponse getStats() {
        List<Utilisateur> users = utilisateurRepository.findAll();
        long totalClients = users.stream().filter(u -> u.getRole() == RoleUtilisateur.CLIENT).count();
        long totalPros = users.stream().filter(u -> u.getRole() == RoleUtilisateur.PRO).count();
        long totalAdmins = users.stream().filter(u -> u.getRole() == RoleUtilisateur.ADMIN).count();

        List<Bien> biens = bienRepository.findAll();
        Map<String, Long> biensParStatut = biens.stream()
                .filter(b -> b.getStatut() != null)
                .collect(Collectors.groupingBy(b -> b.getStatut().name(), Collectors.counting()));
        long biensPublies = biensParStatut.getOrDefault(StatutAnnonce.PUBLIE.name(), 0L);

        Map<String, Long> abonnementsParPlan = abonnementProRepository.findAll().stream()
                .filter(a -> a.getTypeAbonnement() != null)
                .collect(Collectors.groupingBy(a -> a.getTypeAbonnement().name(), Collectors.counting()));

        long signalementsActifs = signalementRepository
                .findByStatutOrderByCreatedAtDesc(StatutSignalement.EN_ATTENTE).size();

        List<AdminUserResponse> recents = users.stream()
                .sorted(Comparator.comparing(Utilisateur::getDateInscription,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(this::toUserResponse)
                .collect(Collectors.toList());

        return AdminStatsResponse.builder()
                .totalUtilisateurs(users.size())
                .totalClients(totalClients)
                .totalPros(totalPros)
                .totalAdmins(totalAdmins)
                .totalBiens(biens.size())
                .biensPublies(biensPublies)
                .biensParStatut(biensParStatut)
                .abonnementsParPlan(abonnementsParPlan)
                .signalementsActifs(signalementsActifs)
                .utilisateursRecents(recents)
                .build();
    }

    // ─── Utilisateurs ─────────────────────────────────────────────────────────

    public List<AdminUserResponse> getAllUsers() {
        return utilisateurRepository.findAll().stream()
                .sorted(Comparator.comparing(Utilisateur::getDateInscription,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse updateUserStatut(Long userId, StatutUtilisateur nouveauStatut) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'ID : " + userId));

        // Sécurité : on ne suspend / bannit pas un compte administrateur.
        if (user.getRole() == RoleUtilisateur.ADMIN) {
            throw new IllegalStateException("Le statut d'un compte administrateur ne peut pas être modifié.");
        }

        user.setStatut(nouveauStatut);
        return toUserResponse(utilisateurRepository.save(user));
    }

    // ─── Biens ────────────────────────────────────────────────────────────────

    public List<AdminBienResponse> getAllBiens() {
        return bienRepository.findAll().stream()
                .sorted(Comparator.comparing(Bien::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toBienResponse)
                .collect(Collectors.toList());
    }

    /**
     * Override administrateur : l'admin peut changer le statut de n'importe quel bien
     * (suspendre, republier, archiver) sans être le propriétaire.
     */
    @Transactional
    public AdminBienResponse updateBienStatut(Long bienId, StatutAnnonce nouveauStatut) {
        Bien bien = bienRepository.findById(bienId)
                .orElseThrow(() -> new IllegalArgumentException("Bien non trouvé avec l'ID : " + bienId));

        bien.setStatut(nouveauStatut);
        return toBienResponse(bienRepository.save(bien));
    }

    // ─── Mappers privés ─────────────────────────────────────────────────────────

    private AdminUserResponse toUserResponse(Utilisateur u) {
        return AdminUserResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(u.getRole())
                .statut(u.getStatut())
                .nbBiens(u.getBiens() != null ? u.getBiens().size() : 0)
                .dateInscription(u.getDateInscription())
                .build();
    }

    private AdminBienResponse toBienResponse(Bien b) {
        Utilisateur proprio = b.getProprietaire();
        return AdminBienResponse.builder()
                .id(b.getId())
                .titre(b.getTitre())
                .typeBien(b.getTypeBien())
                .typeOperation(b.getTypeOperation())
                .statut(b.getStatut())
                .prix(b.getPrix())
                .ville(b.getVille())
                .urlPhotoPrincipale(extractMainPhotoUrl(b.getPhotos()))
                .proprietaireId(proprio != null ? proprio.getId() : null)
                .proprietaireNom(proprio != null ? formatNom(proprio) : "—")
                .proprietaireEmail(proprio != null ? proprio.getEmail() : null)
                .createdAt(b.getCreatedAt())
                .build();
    }

    private String formatNom(Utilisateur u) {
        String prenom = u.getPrenom() != null ? u.getPrenom() : "";
        String nom = u.getNom() != null ? u.getNom() : "";
        return (prenom + " " + nom).trim();
    }

    private String extractMainPhotoUrl(List<PhotoBien> photos) {
        if (photos == null || photos.isEmpty()) {
            return null;
        }
        return photos.stream()
                .filter(PhotoBien::isEstPrincipale)
                .findFirst()
                .map(PhotoBien::getUrlCloudinary)
                .orElseGet(() -> photos.get(0).getUrlCloudinary());
    }
}
