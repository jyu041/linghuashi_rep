// backend/src/main/java/org/jyu041/backend/dto/PlayerPositionMessage.java
package org.jyu041.backend.dto;

public class PlayerPositionMessage {
    private String userId;
    private double x;
    private double y;
    private long timestamp;

    public PlayerPositionMessage() {
        this.timestamp = System.currentTimeMillis();
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
