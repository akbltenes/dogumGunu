package com.dogumgunu.backend.controller;

import com.dogumgunu.backend.dto.TimelineEventDto;
import com.dogumgunu.backend.service.FirebaseStorageService;
import com.dogumgunu.backend.service.TimelineEventService;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineEventController {

    private final TimelineEventService service;
    private final FirebaseStorageService firebaseStorageService;

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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public TimelineEventDto uploadWithPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("eventDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eventDate,
            @RequestParam("description") String description,
            @RequestParam(value = "interactionType", defaultValue = "NONE") String interactionType,
            @RequestParam(value = "interactionPayload", required = false) String interactionPayloadJson) {

        // Temporarily disable Firebase upload for testing
        String mediaUrl = "https://via.placeholder.com/400x300.png?text=" + title.replace(" ", "+");
        // String mediaUrl = firebaseStorageService.uploadFile(file, "timeline");

        com.fasterxml.jackson.databind.JsonNode interactionPayload = null;
        if (interactionPayloadJson != null && !interactionPayloadJson.isEmpty()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                interactionPayload = mapper.readTree(interactionPayloadJson);
            } catch (Exception e) {
                throw new RuntimeException("Invalid interaction payload JSON", e);
            }
        }

        TimelineEventDto dto = new TimelineEventDto(
                null,
                title,
                eventDate,
                description,
                mediaUrl,
                com.dogumgunu.backend.enums.TimelineInteractionType.valueOf(interactionType),
                interactionPayload
        );

        return service.create(dto);
    }
}
