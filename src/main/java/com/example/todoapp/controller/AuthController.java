package com.example.todoapp.controller;

import com.example.todoapp.dto.AuthRequest;
import com.example.todoapp.dto.AuthResponse;
import com.example.todoapp.dto.ForgotPasswordRequest;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.dto.ResetPasswordRequest;
import com.example.todoapp.dto.UpdateProfileRequest;
import com.example.todoapp.dto.VerifyOtpRequest;
import com.example.todoapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return userService.login(request);
    }

    @GetMapping("/me")
    public AuthResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.getCurrentUser(email);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return Map.of("message", "OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        userService.verifyOtp(request);
        return Map.of("message", "OTP verified successfully");
    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> resetPassword(@RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return Map.of("message", "Password changed successfully");
    }

    @PutMapping("/update-profile")
    public AuthResponse updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.updateProfile(email, request);
    }
}
