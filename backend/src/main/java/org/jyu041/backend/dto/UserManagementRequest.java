// backend/src/main/java/org/jyu041/backend/dto/UserManagementRequest.java
package org.jyu041.backend.dto;

public class UserManagementRequest {
    private String userId;
    private String action; // BAN, UNBAN, RESET, etc.
    private String reason;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}