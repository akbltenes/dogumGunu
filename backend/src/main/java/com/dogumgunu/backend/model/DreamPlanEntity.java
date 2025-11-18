package com.dogumgunu.backend.model;

import com.dogumgunu.backend.common.domain.BaseAuditableEntity;
import com.dogumgunu.backend.enums.PlanStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dream_plans")
public class DreamPlanEntity extends BaseAuditableEntity {

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private PlanStatus status = PlanStatus.PLANNED;

    @Column(name = "extra_notes", columnDefinition = "TEXT")
    private String extraNotes;
}
