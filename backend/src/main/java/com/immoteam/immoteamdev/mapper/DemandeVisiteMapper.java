package com.immoteam.immoteamdev.mapper;

import com.immoteam.immoteamdev.dto.DemandeVisiteRequest;
import com.immoteam.immoteamdev.dto.DemandeVisiteResponse;
import com.immoteam.immoteamdev.entity.DemandeVisite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {BienMapper.class})
public interface DemandeVisiteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bien", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "motifRefus", ignore = true)
    @Mapping(target = "dateConfirmation", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    DemandeVisite toEntity(DemandeVisiteRequest request);

    @Mapping(source = "client", target = "client")
    @Mapping(source = "proprietaire", target = "proprietaire")
    DemandeVisiteResponse toResponse(DemandeVisite demandeVisite);
}
