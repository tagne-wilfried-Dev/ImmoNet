package com.immoteam.immoteamdev.mapper;

import com.immoteam.immoteamdev.dto.BienCreateRequest;
import com.immoteam.immoteamdev.dto.BienDetailResponse;
import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.dto.BienUpdateRequest;
import com.immoteam.immoteamdev.dto.ProprietaireSummaryDTO;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.PhotoBien;
import com.immoteam.immoteamdev.entity.Utilisateur;
import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BienMapper {

    // Conversion Entité -> DTO de création (utile pour l'édition)
    BienCreateRequest toRequest(Bien bien);

    // Conversion DTO de création -> Entité
    // Note : Le service devra injecter manuellement le 'proprietaire' et définir le
    // 'statut' initial
    Bien toEntity(BienCreateRequest request);

    // Conversion Entité -> DTO de résumé pour les listes
    @Mapping(target = "urlPhotoPrincipale", source = "photos", qualifiedByName = "extractMainPhotoUrl")
    BienSummaryResponse toSummaryResponse(Bien bien);

    @Named("extractMainPhotoUrl")
    default String extractMainPhotoUrl(List<PhotoBien> photos) {
        if (photos == null || photos.isEmpty()) {
            return null;
        }
        return photos.stream()
                .filter(PhotoBien::isEstPrincipale)
                .findFirst()
                .map(PhotoBien::getUrlCloudinary)
                .orElseGet(() -> photos.get(0).getUrlCloudinary()); // Fallback sur la première photo si aucune n'est
                                                                    // marquée principale
    }

    @Mapping(source = "proprietaire", target = "proprietaire")
    @Mapping(source = "photos", target = "urlsPhotos", qualifiedByName = "mapPhotosToUrls")
    BienDetailResponse toDetailResponse(Bien bien);

    @Named("mapPhotosToUrls")
    default List<String> mapPhotosToUrls(List<PhotoBien> photos) {
        if (photos == null) {
            return List.of();
        }
        return photos.stream()
                .filter(PhotoBien::isEstPrincipale) // Ou trier par ordre si besoin
                .map(PhotoBien::getUrlCloudinary)
                .collect(Collectors.toList());
    }

    default ProprietaireSummaryDTO toProprietaireSummary(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }
        return ProprietaireSummaryDTO.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .estPro(utilisateur.getRole() == RoleUtilisateur.PRO)
                .telephone(utilisateur.getTelephone())
                .build();
    }

    /**
     * Met à jour une entité Bien existante avec les valeurs du DTO.
     * NullValuePropertyMappingStrategy.IGNORE empêche l'écrasement des champs 
     * existants par null si le frontend ne les envoie pas.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true) // On ne peut pas changer l'ID
    @Mapping(target = "proprietaire", ignore = true) // On ne peut pas changer le propriétaire via cet endpoint
    @Mapping(target = "statut", ignore = true) // Le statut se gère via un endpoint dédié
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "photos", ignore = true) // Les photos se gèrent via l'endpoint dédié /photos
    void updateBienFromRequest(BienUpdateRequest request, @MappingTarget Bien bien);
}