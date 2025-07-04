// backend/src/main/java/org/jyu041/backend/dto/FightResponse.java
package org.jyu041.backend.dto;

import org.jyu041.backend.entity.User;
import org.jyu041.backend.entity.Equipment;
import java.util.List;

public class FightResponse {
    private boolean success;
    private String message;
    private User user;
    private List<Equipment> droppedItems;
    private int xpGained;
    private int eliteBossCharges;
    private String specialMessage;

    public FightResponse(boolean success, String message, User user,
                         List<Equipment> droppedItems, int xpGained,
                         int eliteBossCharges, String specialMessage) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.droppedItems = droppedItems;
        this.xpGained = xpGained;
        this.eliteBossCharges = eliteBossCharges;
        this.specialMessage = specialMessage;
    }

    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Equipment> getDroppedItems() { return droppedItems; }
    public void setDroppedItems(List<Equipment> droppedItems) { this.droppedItems = droppedItems; }

    public int getXpGained() { return xpGained; }
    public void setXpGained(int xpGained) { this.xpGained = xpGained; }

    public int getEliteBossCharges() { return eliteBossCharges; }
    public void setEliteBossCharges(int eliteBossCharges) { this.eliteBossCharges = eliteBossCharges; }

    public String getSpecialMessage() { return specialMessage; }
    public void setSpecialMessage(String specialMessage) { this.specialMessage = specialMessage; }
}