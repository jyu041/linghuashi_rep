// backend/src/main/java/org/jyu041/backend/dto/GameResponse.java
package org.jyu041.backend.dto;

import org.jyu041.backend.entity.User;

public class GameResponse {
    private boolean success;
    private String message;
    private User user;

    public GameResponse(boolean success, String message, User user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}