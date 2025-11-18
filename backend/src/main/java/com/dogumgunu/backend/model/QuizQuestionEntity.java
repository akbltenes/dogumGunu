package com.dogumgunu.backend.model;

import com.dogumgunu.backend.common.domain.BaseAuditableEntity;
import com.dogumgunu.backend.enums.QuizDifficulty;
import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Getter
@Setter
@Entity
@Table(name = "quiz_questions")
public class QuizQuestionEntity extends BaseAuditableEntity {

    @Column(name = "question", nullable = false, columnDefinition = "TEXT")
    private String question;

    @Type(JsonType.class)
    @Column(name = "options", nullable = false, columnDefinition = "jsonb")
    private JsonNode options;

    @Column(name = "correct_option", nullable = false)
    private Short correctOption;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "reward_media_url", length = 512)
    private String rewardMediaUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 16)
    private QuizDifficulty difficulty = QuizDifficulty.EASY;
}
