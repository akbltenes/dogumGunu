package com.dogumgunu.backend.dto;

import com.dogumgunu.backend.enums.QuizDifficulty;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.UUID;

public record QuizQuestionDto(
        UUID id,
        String question,
        JsonNode options,
        Short correctOption,
        String explanation,
        String rewardMediaUrl,
        QuizDifficulty difficulty
) {
}
