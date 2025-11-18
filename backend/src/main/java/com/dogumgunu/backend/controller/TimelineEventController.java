package com.dogumgunu.backend.controller;

import com.dogumgunu.backend.dto.TimelineEventDto;
import com.dogumgunu.backend.service.TimelineEventService;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineEventController {

    private final TimelineEventService service;

    @GetMapping
    public List<TimelineEventDto> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public TimelineEventDto getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/range")
    public List<TimelineEventDto> listBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return service.listBetween(startDate, endDate);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TimelineEventDto create(@RequestBody TimelineEventDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public TimelineEventDto update(@PathVariable UUID id, @RequestBody TimelineEventDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
