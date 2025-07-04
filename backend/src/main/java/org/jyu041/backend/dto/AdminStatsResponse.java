// backend/src/main/java/org/jyu041/backend/dto/AdminStatsResponse.java
package org.jyu041.backend.dto;

import java.util.Map;

public class AdminStatsResponse {
    private boolean success;
    private String message;
    private Map<String, Object> stats;

    public AdminStatsResponse(boolean success, String message, Map<String, Object> stats) {
        this.success = success;
        this.message = message;
        this.stats = stats;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }
}