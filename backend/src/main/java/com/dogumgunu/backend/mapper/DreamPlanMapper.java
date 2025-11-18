package com.dogumgunu.backend.mapper;

import com.dogumgunu.backend.dto.DreamPlanDto;
import com.dogumgunu.backend.model.DreamPlanEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DreamPlanMapper {

    DreamPlanDto toDto(DreamPlanEntity entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    DreamPlanEntity toEntity(DreamPlanDto dto);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromDto(DreamPlanDto dto, @MappingTarget DreamPlanEntity entity);
}
