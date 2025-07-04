// backend/src/main/java/org/jyu041/backend/controller/GameController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.dto.FightEnemyRequest;
import org.jyu041.backend.dto.FightResponse;
import org.jyu041.backend.dto.EquipItemRequest;
import org.jyu041.backend.dto.GameResponse;
import org.jyu041.backend.service.GameService;
import org.jyu041.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private AuthService authService;

    @PostMapping("/fight-enemy")
    public ResponseEntity<FightResponse> fightEnemy(
            @RequestHeader("Authorization") String token,
            @RequestBody FightEnemyRequest request) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            FightResponse response = gameService.fightEnemy(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new FightResponse(false, e.getMessage(), null, null, 0, 0, null));
        }
    }

    @PostMapping("/fight-elite-boss")
    public ResponseEntity<FightResponse> fightEliteBoss(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            FightResponse response = gameService.fightEliteBoss(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new FightResponse(false, e.getMessage(), null, null, 0, 0, null));
        }
    }

    @PostMapping("/equip-item")
    public ResponseEntity<GameResponse> equipItem(
            @RequestHeader("Authorization") String token,
            @RequestBody EquipItemRequest request) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.equipItem(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/sell-item")
    public ResponseEntity<GameResponse> sellItem(
            @RequestHeader("Authorization") String token,
            @RequestParam String itemId) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.sellItem(userId, itemId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/attempt-breakthrough")
    public ResponseEntity<GameResponse> attemptBreakthrough(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.attemptBreakthrough(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/upgrade-loot-level")
    public ResponseEntity<GameResponse> upgradeLootLevel(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.upgradeLootLevel(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/upgrade-x-multiplier")
    public ResponseEntity<GameResponse> upgradeXMultiplier(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.upgradeXMultiplier(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/user-stats")
    public ResponseEntity<GameResponse> getUserStats(@RequestHeader("Authorization") String token) {
        try {
            String userId = authService.validateTokenAndGetUserId(token);
            GameResponse response = gameService.getUserStats(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new GameResponse(false, e.getMessage(), null));
        }
    }
}