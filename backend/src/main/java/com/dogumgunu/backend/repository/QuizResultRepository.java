package com.dogumgunu.backend.repository;

import com.dogumgunu.backend.model.QuizResultEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizResultRepository extends JpaRepository<QuizResultEntity, UUID> {
    List<QuizResultEntity> findAllByUsernameOrderByCompletedAtDesc(String username);
}
