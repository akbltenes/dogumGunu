package com.dogumgunu.backend.model;

import com.dogumgunu.backend.common.domain.BaseAuditableEntity;
import com.dogumgunu.backend.enums.TimelineInteractionType;
import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Getter
@Setter
@Entity
@Table(name = "timeline_events")
public class TimelineEventEntity extends BaseAuditableEntity {

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "media_url", length = 512)
    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "interaction_type", nullable = false, length = 32)
    private TimelineInteractionType interactionType = TimelineInteractionType.NONE;

    @Type(JsonType.class)
    @Column(name = "interaction_payload", columnDefinition = "jsonb")
    private JsonNode interactionPayload;
}
