// backend/src/main/java/org/jyu041/backend/dto/AuthResponse.java
package org.jyu041.backend.dto;

import org.jyu041.backend.entity.User;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private User user;

    public AuthResponse(boolean success, String message, String token, User user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}