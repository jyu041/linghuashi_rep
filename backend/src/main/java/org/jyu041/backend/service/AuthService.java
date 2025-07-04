// backend/src/main/java/org/jyu041/backend/service/AuthService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.User;
import org.jyu041.backend.dto.*;
import org.jyu041.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // In-memory token storage (in production, use Redis or JWT)
    private Map<String, String> tokenToUserId = new ConcurrentHashMap<>();
    private Map<String, LocalDateTime> tokenExpiry = new ConcurrentHashMap<>();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = generateToken(user.getId());
        return new AuthResponse(true, "Registration successful", token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);

        String token = generateToken(user.getId());
        return new AuthResponse(true, "Login successful", token, user);
    }

    public AuthResponse completeInitialSelection(String userId, InitialSelectionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isInitialSelectionComplete()) {
            throw new RuntimeException("Initial selection already completed");
        }

        user.setDisplayName(request.getDisplayName());
        user.setProfession(request.getProfession());
        user.setGender(request.getGender());
        user.setInitialSelectionComplete(true);

        user = userRepository.save(user);

        return new AuthResponse(true, "Initial selection completed", null, user);
    }

    public AuthResponse getUserData(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(true, "User data retrieved", null, user);
    }

    public String validateTokenAndGetUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }

        String token = authHeader.substring(7);
        String userId = tokenToUserId.get(token);
        LocalDateTime expiry = tokenExpiry.get(token);

        if (userId == null || expiry == null || expiry.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token");
        }

        return userId;
    }

    private String generateToken(String userId) {
        String token = UUID.randomUUID().toString();
        tokenToUserId.put(token, userId);
        tokenExpiry.put(token, LocalDateTime.now().plusHours(24)); // 24 hour expiry
        return token;
    }
}