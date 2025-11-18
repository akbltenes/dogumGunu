package com.dogumgunu.backend.mapper;

import com.dogumgunu.backend.dto.TimelineEventDto;
import com.dogumgunu.backend.model.TimelineEventEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TimelineEventMapper {

    TimelineEventDto toDto(TimelineEventEntity entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    TimelineEventEntity toEntity(TimelineEventDto dto);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromDto(TimelineEventDto dto, @MappingTarget TimelineEventEntity entity);
}
