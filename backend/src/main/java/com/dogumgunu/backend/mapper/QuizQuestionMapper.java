package com.dogumgunu.backend.mapper;

import com.dogumgunu.backend.dto.QuizQuestionDto;
import com.dogumgunu.backend.model.QuizQuestionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuizQuestionMapper {

    QuizQuestionDto toDto(QuizQuestionEntity entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    QuizQuestionEntity toEntity(QuizQuestionDto dto);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromDto(QuizQuestionDto dto, @MappingTarget QuizQuestionEntity entity);
}
