package com.dogumgunu.backend.service;

import com.dogumgunu.backend.dto.QuizQuestionDto;
import com.dogumgunu.backend.dto.QuizResultDto;
import com.dogumgunu.backend.enums.QuizDifficulty;
import java.util.List;
import java.util.UUID;

public interface QuizService {

    List<QuizQuestionDto> listAllQuestions();

    List<QuizQuestionDto> listQuestionsByDifficulty(QuizDifficulty difficulty);

    QuizQuestionDto getQuestion(UUID id);

    QuizQuestionDto createQuestion(QuizQuestionDto dto);

    QuizQuestionDto updateQuestion(UUID id, QuizQuestionDto dto);

    void deleteQuestion(UUID id);

    QuizResultDto recordResult(QuizResultDto dto);

    List<QuizResultDto> listResultsForUser(String username);
}
