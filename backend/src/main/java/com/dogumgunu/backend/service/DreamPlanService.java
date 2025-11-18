package com.dogumgunu.backend.service;

import com.dogumgunu.backend.dto.DreamPlanDto;
import com.dogumgunu.backend.enums.PlanStatus;
import java.util.List;
import java.util.UUID;

public interface DreamPlanService {

    List<DreamPlanDto> listAll();

    List<DreamPlanDto> listByStatus(PlanStatus status);

    DreamPlanDto getById(UUID id);

    DreamPlanDto create(DreamPlanDto dto);

    DreamPlanDto update(UUID id, DreamPlanDto dto);

    void delete(UUID id);
}
