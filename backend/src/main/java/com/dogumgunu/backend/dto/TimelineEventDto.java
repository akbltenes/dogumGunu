package com.dogumgunu.backend.dto;

import com.dogumgunu.backend.enums.TimelineInteractionType;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDate;
import java.util.UUID;

public record TimelineEventDto(
        UUID id,
        String title,
        LocalDate eventDate,
        String description,
        String mediaUrl,
        TimelineInteractionType interactionType,
        JsonNode interactionPayload
) {
}
