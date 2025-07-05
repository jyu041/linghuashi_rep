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
            case "帝品.精": return "linear-gradient(to right, #800080 0%, #0000FF 100%)";
            case "帝品.珍": return "linear-gradient(to right, #228B22 0%, #90EE90 100%)";
            case "帝品.极": return "linear-gradient(to right, #191970 0%, #87CEEB 100%)";
            case "帝品.绝": return "linear-gradient(to right, #4B0082 0%, #DDA0DD 100%)";
            case "仙品.精": return "linear-gradient(to right, #B8860B 0%, #FFD700 100%)";
            case "仙品.极": return "linear-gradient(to right, #8B0000 0%, #FFB6B6 100%)";
            default: return "#808080";
        }
    }

    private int calculateSellValue(String tier, int level) {
        int baseValue = switch (tier) {
            case "凡品" -> 1;
            case "良品" -> 5;
            case "上品" -> 15;
            case "极品" -> 50;
            case "灵品" -> 150;
            case "王品" -> 500;
            case "圣品" -> 1500;
            case "帝品" -> 5000;
            case "帝品.精" -> 15000;
            case "帝品.珍" -> 50000;
            case "帝品.极" -> 150000;
            case "帝品.绝" -> 500000;
            case "仙品.精" -> 1500000;
            case "仙品.极" -> 5000000;
            default -> 1;
        };
        return baseValue * level;
    }

    private void generateRandomStats(String tier, int level) {
        int tierMultiplier = switch (tier) {
            case "凡品" -> 1;
            case "良品" -> 2;
            case "上品" -> 4;
            case "极品" -> 8;
            case "灵品" -> 16;
            case "王品" -> 32;
            case "圣品" -> 64;
            case "帝品" -> 128;
            case "帝品.精" -> 256;
            case "帝品.珍" -> 512;
            case "帝品.极" -> 1024;
            case "帝品.绝" -> 2048;
            case "仙品.精" -> 4096;
            case "仙品.极" -> 8192;
            default -> 1;
        };

        // Generate random stats based on tier and level
        this.healthBonus = (int) (Math.random() * 10 * tierMultiplier * level / 5);
        this.attackBonus = (int) (Math.random() * 5 * tierMultiplier * level / 5);
        this.defenseBonus = (int) (Math.random() * 5 * tierMultiplier * level / 5);
        this.speedBonus = (int) (Math.random() * 3 * tierMultiplier * level / 5);
        this.powerRatingBonus = (int) (Math.random() * 20 * tierMultiplier * level / 5);
    }

    // Getters and setters
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