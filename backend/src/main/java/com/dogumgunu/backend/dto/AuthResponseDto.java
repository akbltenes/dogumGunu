package com.dogumgunu.backend.dto;

public record AuthResponseDto(String message, String token) {
    public AuthResponseDto(String message) {
        this(message, null);
    }
}
