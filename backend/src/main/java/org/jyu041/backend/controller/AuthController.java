// backend/src/main/java/org/jyu041/backend/controller/AuthController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.dto.LoginRequest;
import org.jyu041.backend.dto.RegisterRequest;
import org.jyu041.backend.dto.InitialSelectionRequest;
import org.jyu041.backend.dto.AuthResponse;
import org.jyu041.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    @PostMapping("/initial-selection")
    public ResponseEntity<AuthResponse> completeInitialSelection(
            @RequestHeader("Authorization") String token,
            @RequestBody InitialSelectionRequest request) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            AuthResponse response = authService.completeInitialSelection(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            AuthResponse response = authService.getUserData(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }
}