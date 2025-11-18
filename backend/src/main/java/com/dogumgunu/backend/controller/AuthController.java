package com.dogumgunu.backend.controller;

import com.dogumgunu.backend.dto.AuthRequestDto;
import com.dogumgunu.backend.dto.AuthResponseDto;
import com.dogumgunu.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponseDto login(@Valid @RequestBody AuthRequestDto requestDto) {
        return authService.login(requestDto);
    }
}
