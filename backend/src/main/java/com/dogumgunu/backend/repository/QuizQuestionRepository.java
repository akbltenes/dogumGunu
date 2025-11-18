package com.dogumgunu.backend.repository;

import com.dogumgunu.backend.enums.QuizDifficulty;
import com.dogumgunu.backend.model.QuizQuestionEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestionEntity, UUID> {
    List<QuizQuestionEntity> findAllByDifficultyOrderByCreatedAtAsc(QuizDifficulty difficulty);
}
