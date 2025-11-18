package com.dogumgunu.backend.service.impl;

import com.dogumgunu.backend.dto.TimelineEventDto;
import com.dogumgunu.backend.mapper.TimelineEventMapper;
import com.dogumgunu.backend.model.TimelineEventEntity;
import com.dogumgunu.backend.repository.TimelineEventRepository;
import com.dogumgunu.backend.service.TimelineEventService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TimelineEventServiceImpl implements TimelineEventService {

    private final TimelineEventRepository repository;
    private final TimelineEventMapper mapper;

    @Override
    public List<TimelineEventDto> listAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public TimelineEventDto getById(UUID id) {
        return mapper.toDto(findEntity(id));
    }

    @Override
    public List<TimelineEventDto> listBetween(LocalDate startDate, LocalDate endDate) {
        return repository.findAllByEventDateBetweenOrderByEventDateAsc(startDate, endDate)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public TimelineEventDto create(TimelineEventDto dto) {
        TimelineEventEntity entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public TimelineEventDto update(UUID id, TimelineEventDto dto) {
        TimelineEventEntity entity = findEntity(id);
        mapper.updateEntityFromDto(dto, entity);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        TimelineEventEntity entity = findEntity(id);
        repository.delete(entity);
    }

    private TimelineEventEntity findEntity(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Timeline event not found: " + id));
    }
}
