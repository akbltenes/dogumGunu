package com.dogumgunu.backend.service.impl;

import com.dogumgunu.backend.dto.QuizQuestionDto;
import com.dogumgunu.backend.dto.QuizResultDto;
import com.dogumgunu.backend.enums.QuizDifficulty;
import com.dogumgunu.backend.mapper.QuizQuestionMapper;
import com.dogumgunu.backend.mapper.QuizResultMapper;
import com.dogumgunu.backend.model.QuizQuestionEntity;
import com.dogumgunu.backend.model.QuizResultEntity;
import com.dogumgunu.backend.repository.QuizQuestionRepository;
import com.dogumgunu.backend.repository.QuizResultRepository;
import com.dogumgunu.backend.service.QuizService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizServiceImpl implements QuizService {

    private final QuizQuestionRepository questionRepository;
    private final QuizResultRepository resultRepository;
    private final QuizQuestionMapper questionMapper;
    private final QuizResultMapper resultMapper;

    @Override
    public List<QuizQuestionDto> listAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(questionMapper::toDto)
                .toList();
    }

    @Override
    public List<QuizQuestionDto> listQuestionsByDifficulty(QuizDifficulty difficulty) {
        return questionRepository.findAllByDifficultyOrderByCreatedAtAsc(difficulty)
                .stream()
                .map(questionMapper::toDto)
                .toList();
    }

    @Override
    public QuizQuestionDto getQuestion(UUID id) {
        return questionMapper.toDto(findQuestion(id));
    }

    @Override
    @Transactional
    public QuizQuestionDto createQuestion(QuizQuestionDto dto) {
        QuizQuestionEntity entity = questionMapper.toEntity(dto);
        return questionMapper.toDto(questionRepository.save(entity));
    }

    @Override
    @Transactional
    public QuizQuestionDto updateQuestion(UUID id, QuizQuestionDto dto) {
        QuizQuestionEntity entity = findQuestion(id);
        questionMapper.updateEntityFromDto(dto, entity);
        return questionMapper.toDto(questionRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID id) {
        QuizQuestionEntity entity = findQuestion(id);
        questionRepository.delete(entity);
    }

    @Override
    @Transactional
    public QuizResultDto recordResult(QuizResultDto dto) {
        QuizResultEntity entity = resultMapper.toEntity(dto);
        return resultMapper.toDto(resultRepository.save(entity));
    }

    @Override
    public List<QuizResultDto> listResultsForUser(String username) {
        return resultRepository.findAllByUsernameOrderByCompletedAtDesc(username)
                .stream()
                .map(resultMapper::toDto)
                .toList();
    }

    private QuizQuestionEntity findQuestion(UUID id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Quiz question not found: " + id));
    }
}
