// backend/src/main/java/org/jyu041/backend/controller/AdminController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.dto.AdminStatsResponse;
import org.jyu041.backend.dto.UserManagementRequest;
import org.jyu041.backend.dto.GameResponse;
import org.jyu041.backend.service.AdminService;
import org.jyu041.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats(
            @RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            AdminStatsResponse response = adminService.getAdminStats();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AdminStatsResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/user-management")
    public ResponseEntity<GameResponse> manageUser(
            @RequestHeader("Authorization") String token,
            @RequestBody UserManagementRequest request) {
        try {
            String adminId = authService.validateTokenAndGetUserId(token);
            GameResponse response = adminService.manageUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/give-currency")
    public ResponseEntity<GameResponse> giveCurrency(
            @RequestHeader("Authorization") String token,
            @RequestParam String targetUserId,
            @RequestParam String currencyType,
            @RequestParam long amount) {
        try {
            String adminId = authService.validateTokenAndGetUserId(token);
            GameResponse response = adminService.giveCurrency(targetUserId, currencyType, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/set-level")
    public ResponseEntity<GameResponse> setUserLevel(
            @RequestHeader("Authorization") String token,
            @RequestParam String targetUserId,
            @RequestParam int level) {
        try {
            String adminId = authService.validateTokenAndGetUserId(token);
            GameResponse response = adminService.setUserLevel(targetUserId, level);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }
}