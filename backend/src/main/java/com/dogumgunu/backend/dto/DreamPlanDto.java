package com.dogumgunu.backend.dto;

import com.dogumgunu.backend.enums.PlanStatus;
import java.time.LocalDate;
import java.util.UUID;

public record DreamPlanDto(
        UUID id,
        String title,
        String description,
        LocalDate targetDate,
        PlanStatus status,
        String extraNotes
) {
}
