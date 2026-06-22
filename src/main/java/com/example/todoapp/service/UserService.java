package com.example.todoapp.service;

import com.example.todoapp.config.JwtUtil;
import com.example.todoapp.dto.AuthRequest;
import com.example.todoapp.dto.AuthResponse;
import com.example.todoapp.dto.ForgotPasswordRequest;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.dto.ResetPasswordRequest;
import com.example.todoapp.dto.UpdateProfileRequest;
import com.example.todoapp.dto.VerifyOtpRequest;
import com.example.todoapp.entity.User;
import com.example.todoapp.exception.ValidationException;
import com.example.todoapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    private static class OtpData {
        final String otp;
        final long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    private void fail(String field, String message) {
        throw new ValidationException(List.of(new ValidationException.FieldError(field, message)));
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            fail("name", "Name is required");
        } else if (!request.getName().trim().contains(" ")) {
            fail("name", "First and last name required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            fail("email", "Email is required");
        } else if (!request.getEmail().contains("@")) {
            fail("email", "Enter a valid email");
        } else if (userRepository.existsByEmail(request.getEmail())) {
            fail("email", "Email already registered");
        }
        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            fail("confirmPassword", "Confirm password is required");
        } else if (!request.getConfirmPassword().equals(request.getPassword())) {
            fail("confirmPassword", "Passwords do not match");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            fail("password", "Password is required");
        } else if (request.getPassword().length() < 6) {
            fail("password", "Password must be at least 6 characters");
        } else if (!request.getPassword().matches(".*[a-zA-Z].*") || !request.getPassword().matches(".*\\d.*") || !request.getPassword().matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            fail("password", "Password must contain at least 1 character, 1 number, and 1 symbol");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .dob(user.getDob())
                .photo(user.getPhoto())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            fail("email", "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            fail("password", "Password is required");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            fail("email", "Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .dob(user.getDob())
                .photo(user.getPhoto())
                .build();
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(null)
                .name(user.getName())
                .email(user.getEmail())
                .dob(user.getDob())
                .photo(user.getPhoto())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            fail("email", "Email is required");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            fail("email", "Email is not registered");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        long expiryTime = System.currentTimeMillis() + (10 * 60 * 1000);
        otpStore.put(request.getEmail().toLowerCase(), new OtpData(otp, expiryTime));

        try {
            emailService.sendOtpEmail(request.getEmail(), otp);
        } catch (Exception e) {
            fail("email", "Failed to send OTP. Please try again later");
        }
    }

    public void verifyOtp(VerifyOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            fail("email", "Email is required");
        }
        if (request.getOtp() == null || request.getOtp().isBlank()) {
            fail("otp", "OTP is required");
        }

        OtpData otpData = otpStore.get(request.getEmail().toLowerCase());
        if (otpData == null) {
            fail("otp", "No OTP found. Please request a new one");
        }
        if (otpData.isExpired()) {
            otpStore.remove(request.getEmail().toLowerCase());
            fail("otp", "OTP has expired. Please request a new one");
        }
        if (!otpData.otp.equals(request.getOtp())) {
            fail("otp", "Invalid OTP");
        }

        otpStore.remove(request.getEmail().toLowerCase());
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            fail("email", "Email is required");
        }
        if (request.getOtp() == null || request.getOtp().isBlank()) {
            fail("otp", "OTP is required");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            fail("newPassword", "New password is required");
        } else if (request.getNewPassword().length() < 6) {
            fail("newPassword", "Password must be at least 6 characters");
        } else if (!request.getNewPassword().matches(".*[a-zA-Z].*") || !request.getNewPassword().matches(".*\\d.*") || !request.getNewPassword().matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            fail("newPassword", "Must contain 1 letter, 1 number, and 1 symbol");
        }
        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            fail("confirmPassword", "Confirm password is required");
        } else if (!request.getConfirmPassword().equals(request.getNewPassword())) {
            fail("confirmPassword", "Passwords do not match");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            fail("email", "Email is not registered");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            fail("name", "Name is required");
        } else if (request.getName().trim().split("\\s+").length < 2) {
            fail("name", "First and last name required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            fail("email", "User not found");
        }

        boolean hasPasswordChange = request.getNewPassword() != null && !request.getNewPassword().isBlank();

        if (hasPasswordChange) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                fail("currentPassword", "Current password is required");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                fail("currentPassword", "Current password is incorrect");
            }
            if (request.getNewPassword().length() < 6) {
                fail("newPassword", "Password must be at least 6 characters");
            } else if (!request.getNewPassword().matches(".*[a-zA-Z].*") || !request.getNewPassword().matches(".*\\d.*") || !request.getNewPassword().matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
                fail("newPassword", "Must contain 1 letter, 1 number, and 1 symbol");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        user.setName(request.getName().trim());

        if (request.getDob() != null && !request.getDob().isBlank()) {
            user.setDob(request.getDob().trim());
        } else if (request.getDob() != null && request.getDob().isBlank()) {
            user.setDob(null);
        }

        userRepository.save(user);

        return AuthResponse.builder()
                .token(null)
                .name(user.getName())
                .email(user.getEmail())
                .dob(user.getDob())
                .photo(user.getPhoto())
                .build();
    }

    public String uploadPhoto(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new RuntimeException("Invalid file name");
        }

        String extension = originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase();
        if (!List.of("jpg", "jpeg", "png", "webp").contains(extension)) {
            throw new RuntimeException("Only JPG, PNG, and WEBP files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size must be less than 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null) contentType = "image/jpeg";

        String base64 = java.util.Base64.getEncoder().encodeToString(file.getBytes());
        String dataUrl = "data:" + contentType + ";base64," + base64;

        user.setPhoto(dataUrl);
        userRepository.save(user);

        return dataUrl;
    }

    public AuthResponse removePhoto(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoto(null);
        userRepository.save(user);

        return AuthResponse.builder()
                .token(null)
                .name(user.getName())
                .email(user.getEmail())
                .dob(user.getDob())
                .photo(null)
                .build();
    }
}
