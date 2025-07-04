// backend/src/main/java/org/jyu041/backend/controller/WebSocketGameController.java
package org.jyu041.backend.controller;

import org.jyu041.backend.dto.PlayerPositionMessage;
import org.jyu041.backend.dto.AutoFightMessage;
import org.jyu041.backend.service.GameService;
import org.jyu041.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketGameController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameService gameService;

    @Autowired
    private AuthService authService;

    @MessageMapping("/move-player")
    @SendTo("/topic/player-positions")
    public PlayerPositionMessage movePlayer(@Payload PlayerPositionMessage message,
                                            SimpMessageHeaderAccessor headerAccessor) {
        // Validate user session and update position
        try {
            String userId = (String) headerAccessor.getSessionAttributes().get("userId");
            if (userId != null) {
                message.setUserId(userId);
                return message;
            }
        } catch (Exception e) {
            // Handle error
        }
        return null;
    }

    @MessageMapping("/auto-fight")
    public void handleAutoFight(@Payload AutoFightMessage message,
                                SimpMessageHeaderAccessor headerAccessor) {
        try {
            String userId = (String) headerAccessor.getSessionAttributes().get("userId");
            if (userId != null) {
                // Process auto-fight request
                processAutoFight(userId, message);
            }
        } catch (Exception e) {
            // Send error message back to user
            messagingTemplate.convertAndSendToUser(
                    headerAccessor.getSessionId(),
                    "/queue/error",
                    "Auto-fight error: " + e.getMessage()
            );
        }
    }

    private void processAutoFight(String userId, AutoFightMessage message) {
        // This would handle continuous auto-fighting
        // For now, just send updates back to the user
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/auto-fight-update",
                "Auto-fight started"
        );
    }
}