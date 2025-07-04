// backend/src/main/java/org/jyu041/backend/entity/User.java
package org.jyu041.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String displayName;
    private String profession;
    private String gender;
    private boolean initialSelectionComplete;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // Game stats
    private int level;
    private long currentXp;
    private long xpToNextLevel;
    private String cultivationRealm;
    private int powerRating; // 战力
    private int lootDropLevel;
    private int xMultiplier; // X倍
    private int buns; // 包子
    private int eliteBossCharges;
    private int bunsConsumedCount; // Track for elite boss charges

    // Currencies
    private long silverCoins; // 银币
    private long goldCoins; // 元宝
    private long godCoins; // 天衍令

    // Equipment - 12 slots as per description
    private Map<String, Equipment> equippedItems;

    // P2W items owned
    private Map<String, Boolean> ownedP2WItems;

    // Stats
    private int health;
    private int attack;
    private int defense;
    private int speed;

    public User() {
        this.level = 1;
        this.currentXp = 0;
        this.xpToNextLevel = 100;
        this.cultivationRealm = "凝气前期";
        this.powerRating = 0;
        this.lootDropLevel = 1;
        this.xMultiplier = 1;
        this.buns = 100; // Starting buns
        this.eliteBossCharges = 0;
        this.bunsConsumedCount = 0;
        this.silverCoins = 1000;
        this.goldCoins = 0;
        this.godCoins = 0;
        this.equippedItems = new HashMap<>();
        this.ownedP2WItems = new HashMap<>();
        this.health = 100;
        this.attack = 10;
        this.defense = 10;
        this.speed = 10;
        this.createdAt = LocalDateTime.now();
        this.initialSelectionComplete = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public boolean isInitialSelectionComplete() { return initialSelectionComplete; }
    public void setInitialSelectionComplete(boolean initialSelectionComplete) {
        this.initialSelectionComplete = initialSelectionComplete;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getCurrentXp() { return currentXp; }
    public void setCurrentXp(long currentXp) { this.currentXp = currentXp; }

    public long getXpToNextLevel() { return xpToNextLevel; }
    public void setXpToNextLevel(long xpToNextLevel) { this.xpToNextLevel = xpToNextLevel; }

    public String getCultivationRealm() { return cultivationRealm; }
    public void setCultivationRealm(String cultivationRealm) { this.cultivationRealm = cultivationRealm; }

    public int getPowerRating() { return powerRating; }
    public void setPowerRating(int powerRating) { this.powerRating = powerRating; }

    public int getLootDropLevel() { return lootDropLevel; }
    public void setLootDropLevel(int lootDropLevel) { this.lootDropLevel = lootDropLevel; }

    public int getXMultiplier() { return xMultiplier; }
    public void setXMultiplier(int xMultiplier) { this.xMultiplier = xMultiplier; }

    public int getBuns() { return buns; }
    public void setBuns(int buns) { this.buns = buns; }

    public int getEliteBossCharges() { return eliteBossCharges; }
    public void setEliteBossCharges(int eliteBossCharges) { this.eliteBossCharges = eliteBossCharges; }

    public int getBunsConsumedCount() { return bunsConsumedCount; }
    public void setBunsConsumedCount(int bunsConsumedCount) { this.bunsConsumedCount = bunsConsumedCount; }

    public long getSilverCoins() { return silverCoins; }
    public void setSilverCoins(long silverCoins) { this.silverCoins = silverCoins; }

    public long getGoldCoins() { return goldCoins; }
    public void setGoldCoins(long goldCoins) { this.goldCoins = goldCoins; }

    public long getGodCoins() { return godCoins; }
    public void setGodCoins(long godCoins) { this.godCoins = godCoins; }

    public Map<String, Equipment> getEquippedItems() { return equippedItems; }
    public void setEquippedItems(Map<String, Equipment> equippedItems) { this.equippedItems = equippedItems; }

    public Map<String, Boolean> getOwnedP2WItems() { return ownedP2WItems; }
    public void setOwnedP2WItems(Map<String, Boolean> ownedP2WItems) { this.ownedP2WItems = ownedP2WItems; }

    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }

    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }

    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }
}