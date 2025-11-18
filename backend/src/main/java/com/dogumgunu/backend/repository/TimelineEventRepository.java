package com.dogumgunu.backend.repository;

import com.dogumgunu.backend.model.TimelineEventEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimelineEventRepository extends JpaRepository<TimelineEventEntity, UUID> {
    List<TimelineEventEntity> findAllByEventDateBetweenOrderByEventDateAsc(LocalDate startDate, LocalDate endDate);
}
