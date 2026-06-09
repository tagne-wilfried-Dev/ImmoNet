package com.immoteam.immoteamdev.mapper;

import com.immoteam.immoteamdev.dto.BienCreateRequest;
import com.immoteam.immoteamdev.dto.BienSummaryResponse;
import com.immoteam.immoteamdev.entity.Bien;
import com.immoteam.immoteamdev.entity.PhotoBien;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BienMapper {

    // Conversion Entité -> DTO de création (utile pour l'édition)
    BienCreateRequest toRequest(Bien bien);

    // Conversion DTO de création -> Entité 
    // Note : Le service devra injecter manuellement le 'proprietaire' et définir le 'statut' initial
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
                .orElseGet(() -> photos.get(0).getUrlCloudinary()); // Fallback sur la première photo si aucune n'est marquée principale
    }
}