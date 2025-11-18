package com.dogumgunu.backend.service;

import com.dogumgunu.backend.dto.TimelineEventDto;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TimelineEventService {

    List<TimelineEventDto> listAll();

    TimelineEventDto getById(UUID id);

    List<TimelineEventDto> listBetween(LocalDate startDate, LocalDate endDate);

    TimelineEventDto create(TimelineEventDto dto);

    TimelineEventDto update(UUID id, TimelineEventDto dto);

    void delete(UUID id);
}
