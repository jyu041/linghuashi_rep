// backend/src/main/java/org/jyu041/backend/entity/Equipment.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "equipment")
public class Equipment {
    @Id
    private String id;

    private String name;
    private String type; // 武器, 头部, 身体, etc.
    private String tier; // 凡品, 良品, 上品, etc.
    private String color; // Color code for tier
    private int level;
    private int sellValue; // 银币 value when sold

    // Stats bonuses
    private int healthBonus;
    private int attackBonus;
    private int defenseBonus;
    private int speedBonus;
    private int powerRatingBonus;

    public Equipment() {}

    public Equipment(String name, String type, String tier, String color, int level) {
        this.name = name;
        this.type = type;
        this.tier = tier;
        this.color = getCorrectTierColor(tier);
        this.level = level;
        this.sellValue = calculateSellValue(tier, level);
        generateRandomStats(tier, level);
    }

    private String getCorrectTierColor(String tier) {
        switch (tier) {
            case "凡品": return "#808080";
            case "良品": return "#008000";
            case "上品": return "#008B8B";
            case "极品": return "#DDA0DD";
            case "灵品": return "#FFFF00";
            case "王品": return "#FFA500";
            case "圣品": return "#FF0000";
            case "帝品": return "#FFC0CB";
            case "帝品.精": return "linear-gradient(45deg, #800080, #0000FF)";
            case "帝品.珍": return "linear-gradient(45deg, #006400, #90EE90)";
            case "帝品.极": return "linear-gradient(45deg, #00008B, #ADD8E6)";
            case "帝品.绝": return "linear-gradient(45deg, #4B0082, #DDA0DD)";
            case "仙品.精": return "linear-gradient(45deg, #B8860B, #FFD700)";
            case "仙品.极": return "linear-gradient(45deg, #8B0000, #FFB6C1)";
            default: return "#808080";
        }
    }

    private int calculateSellValue(String tier, int level) {
        int baseValue = switch (tier) {
            case "凡品" -> 10;
            case "良品" -> 25;
            case "上品" -> 50;
            case "极品" -> 100;
            case "灵品" -> 200;
            case "王品" -> 500;
            case "圣品" -> 1000;
            case "帝品" -> 2000;
            case "帝品.精" -> 5000;
            case "帝品.珍" -> 8000;
            case "帝品.极" -> 12000;
            case "帝品.绝" -> 20000;
            case "仙品.精" -> 35000;
            case "仙品.极" -> 50000;
            default -> 10;
        };
        return baseValue + (level * 5);
    }

    private void generateRandomStats(String tier, int level) {
        double multiplier = switch (tier) {
            case "凡品" -> 1.0;
            case "良品" -> 1.5;
            case "上品" -> 2.0;
            case "极品" -> 3.0;
            case "灵品" -> 4.0;
            case "王品" -> 6.0;
            case "圣品" -> 8.0;
            case "帝品" -> 12.0;
            case "帝品.精" -> 18.0;
            case "帝品.珍" -> 25.0;
            case "帝品.极" -> 35.0;
            case "帝品.绝" -> 50.0;
            case "仙品.精" -> 75.0;
            case "仙品.极" -> 100.0;
            default -> 1.0;
        };

        int baseValue = (int) (level * multiplier);
        this.healthBonus = (int) (baseValue * (0.8 + Math.random() * 0.4));
        this.attackBonus = (int) (baseValue * (0.8 + Math.random() * 0.4));
        this.defenseBonus = (int) (baseValue * (0.8 + Math.random() * 0.4));
        this.speedBonus = (int) (baseValue * (0.8 + Math.random() * 0.4));
        this.powerRatingBonus = this.healthBonus + this.attackBonus + this.defenseBonus + this.speedBonus;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getSellValue() { return sellValue; }
    public void setSellValue(int sellValue) { this.sellValue = sellValue; }

    public int getHealthBonus() { return healthBonus; }
    public void setHealthBonus(int healthBonus) { this.healthBonus = healthBonus; }

    public int getAttackBonus() { return attackBonus; }
    public void setAttackBonus(int attackBonus) { this.attackBonus = attackBonus; }

    public int getDefenseBonus() { return defenseBonus; }
    public void setDefenseBonus(int defenseBonus) { this.defenseBonus = defenseBonus; }

    public int getSpeedBonus() { return speedBonus; }
    public void setSpeedBonus(int speedBonus) { this.speedBonus = speedBonus; }

    public int getPowerRatingBonus() { return powerRatingBonus; }
    public void setPowerRatingBonus(int powerRatingBonus) { this.powerRatingBonus = powerRatingBonus; }
}