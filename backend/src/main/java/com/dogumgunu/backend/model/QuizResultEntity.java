package com.dogumgunu.backend.model;

import com.dogumgunu.backend.common.domain.BaseAuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "quiz_results")
public class QuizResultEntity extends BaseAuditableEntity {

    @Column(name = "username", nullable = false, length = 64)
    private String username;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "message_shown", columnDefinition = "TEXT")
    private String messageShown;
}
