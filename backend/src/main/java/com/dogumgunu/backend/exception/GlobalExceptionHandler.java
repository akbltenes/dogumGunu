package com.dogumgunu.backend.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ApiError handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return ApiError.of(HttpStatus.UNAUTHORIZED, "Geçersiz kullanıcı adı veya parola", request.getRequestURI());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ApiError handleNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        return ApiError.of(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiError handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Geçersiz alan");
        return ApiError.of(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ApiError handleGeneric(Exception ex, HttpServletRequest request) {
        return ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request.getRequestURI());
    }
}
