package com.dogumgunu.backend.mapper;

import com.dogumgunu.backend.dto.QuizResultDto;
import com.dogumgunu.backend.model.QuizResultEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuizResultMapper {

    QuizResultDto toDto(QuizResultEntity entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    QuizResultEntity toEntity(QuizResultDto dto);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromDto(QuizResultDto dto, @MappingTarget QuizResultEntity entity);
}
