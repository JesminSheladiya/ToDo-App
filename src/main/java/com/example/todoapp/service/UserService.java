package com.example.todoapp.service;

import com.example.todoapp.config.JwtUtil;
import com.example.todoapp.dto.AuthRequest;
import com.example.todoapp.dto.AuthResponse;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.entity.User;
import com.example.todoapp.exception.ValidationException;
import com.example.todoapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
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
                .build();
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(null)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
