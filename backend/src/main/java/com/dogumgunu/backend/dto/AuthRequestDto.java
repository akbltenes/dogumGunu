package com.dogumgunu.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDto(
        @NotBlank(message = "Kullanıcı adı boş olamaz") String username,
        @NotBlank(message = "Parola boş olamaz") String password
) {
}
