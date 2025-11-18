package com.dogumgunu.backend.service;

import com.dogumgunu.backend.dto.AuthRequestDto;
import com.dogumgunu.backend.dto.AuthResponseDto;

public interface AuthService {
    AuthResponseDto login(AuthRequestDto request);
}
