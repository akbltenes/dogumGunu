package com.dogumgunu.backend.service.impl;

import com.dogumgunu.backend.dto.AuthRequestDto;
import com.dogumgunu.backend.dto.AuthResponseDto;
import com.dogumgunu.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDto login(AuthRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        String message = "Hoş geldin, " + authentication.getName() + "!";
        return new AuthResponseDto(message);
    }
}
