package com.dogumgunu.backend.controller;

import com.dogumgunu.backend.dto.DreamPlanDto;
import com.dogumgunu.backend.enums.PlanStatus;
import com.dogumgunu.backend.service.DreamPlanService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class DreamPlanController {

    private final DreamPlanService service;

    @GetMapping
    public List<DreamPlanDto> listPlans(@RequestParam(required = false) PlanStatus status) {
        if (status == null) {
            return service.listAll();
        }
        return service.listByStatus(status);
    }

    @GetMapping("/{id}")
    public DreamPlanDto getPlan(@PathVariable UUID id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DreamPlanDto createPlan(@RequestBody DreamPlanDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public DreamPlanDto updatePlan(@PathVariable UUID id, @RequestBody DreamPlanDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable UUID id) {
        service.delete(id);
    }
}
