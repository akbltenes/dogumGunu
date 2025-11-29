package com.dogumgunu.backend.controller;

import com.dogumgunu.backend.dto.QuizQuestionDto;
import com.dogumgunu.backend.dto.QuizResultDto;
import com.dogumgunu.backend.enums.QuizDifficulty;
import com.dogumgunu.backend.service.QuizService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/questions")
    public List<QuizQuestionDto> listQuestions(@RequestParam(required = false) QuizDifficulty difficulty) {
        if (difficulty == null) {
            return quizService.listAllQuestions();
        }
        return quizService.listQuestionsByDifficulty(difficulty);
    }

    @GetMapping("/questions/random")
    public List<QuizQuestionDto> getRandomQuestions(
            @RequestParam(defaultValue = "5") int count,
            @RequestParam(required = false) QuizDifficulty difficulty
    ) {
        return quizService.getRandomQuestions(count, difficulty);
    }

    @GetMapping("/questions/{id}")
    public QuizQuestionDto getQuestion(@PathVariable UUID id) {
        return quizService.getQuestion(id);
    }

    @PostMapping("/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizQuestionDto createQuestion(@RequestBody QuizQuestionDto dto) {
        return quizService.createQuestion(dto);
    }

    @PutMapping("/questions/{id}")
    public QuizQuestionDto updateQuestion(@PathVariable UUID id, @RequestBody QuizQuestionDto dto) {
        return quizService.updateQuestion(id, dto);
    }

    @DeleteMapping("/questions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestion(@PathVariable UUID id) {
        quizService.deleteQuestion(id);
    }

    @PostMapping("/results")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResultDto recordResult(@RequestBody QuizResultDto dto) {
        return quizService.recordResult(dto);
    }

    @GetMapping("/results")
    public List<QuizResultDto> listResults(@RequestParam String username) {
        return quizService.listResultsForUser(username);
    }
}
