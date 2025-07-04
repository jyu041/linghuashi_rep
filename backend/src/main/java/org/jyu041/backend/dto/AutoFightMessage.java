// backend/src/main/java/org/jyu041/backend/dto/AutoFightMessage.java
package org.jyu041.backend.dto;

public class AutoFightMessage {
    private boolean enabled;
    private String targetType;
    private int duration; // in minutes

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}