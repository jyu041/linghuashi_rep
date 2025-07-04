
// backend/src/main/java/org/jyu041/backend/dto/FightEnemyRequest.java
package org.jyu041.backend.dto;

public class FightEnemyRequest {
    private String enemyType;
    private double positionX;
    private double positionY;

    public String getEnemyType() { return enemyType; }
    public void setEnemyType(String enemyType) { this.enemyType = enemyType; }

    public double getPositionX() { return positionX; }
    public void setPositionX(double positionX) { this.positionX = positionX; }

    public double getPositionY() { return positionY; }
    public void setPositionY(double positionY) { this.positionY = positionY; }
}