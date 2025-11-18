package com.dogumgunu.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record QuizResultDto(
        UUID id,
        String username,
        Integer score,
        Integer maxScore,
        OffsetDateTime completedAt,
        String messageShown
) {
}
