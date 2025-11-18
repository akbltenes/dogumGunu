package com.dogumgunu.backend.service.impl;

import com.dogumgunu.backend.dto.DreamPlanDto;
import com.dogumgunu.backend.enums.PlanStatus;
import com.dogumgunu.backend.mapper.DreamPlanMapper;
import com.dogumgunu.backend.model.DreamPlanEntity;
import com.dogumgunu.backend.repository.DreamPlanRepository;
import com.dogumgunu.backend.service.DreamPlanService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DreamPlanServiceImpl implements DreamPlanService {

    private final DreamPlanRepository repository;
    private final DreamPlanMapper mapper;

    @Override
    public List<DreamPlanDto> listAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public List<DreamPlanDto> listByStatus(PlanStatus status) {
        return repository.findAllByStatusOrderByTargetDateAsc(status)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public DreamPlanDto getById(UUID id) {
        return mapper.toDto(findEntity(id));
    }

    @Override
    @Transactional
    public DreamPlanDto create(DreamPlanDto dto) {
        DreamPlanEntity entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public DreamPlanDto update(UUID id, DreamPlanDto dto) {
        DreamPlanEntity entity = findEntity(id);
        mapper.updateEntityFromDto(dto, entity);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        DreamPlanEntity entity = findEntity(id);
        repository.delete(entity);
    }

    private DreamPlanEntity findEntity(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Dream plan not found: " + id));
    }
}
