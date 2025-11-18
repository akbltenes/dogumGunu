package com.dogumgunu.backend.repository;

import com.dogumgunu.backend.enums.PlanStatus;
import com.dogumgunu.backend.model.DreamPlanEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DreamPlanRepository extends JpaRepository<DreamPlanEntity, UUID> {
    List<DreamPlanEntity> findAllByStatusOrderByTargetDateAsc(PlanStatus status);
}
