// backend/src/main/java/org/jyu041/backend/service/GameService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.User;
import org.jyu041.backend.entity.Equipment;
import org.jyu041.backend.dto.*;
import org.jyu041.backend.repository.UserRepository;
import org.jyu041.backend.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GameService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private LootService lootService;

    @Autowired
    private CultivationService cultivationService;

    public FightResponse fightEnemy(String userId, FightEnemyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int bunsRequired = user.getXMultiplier();
        if (user.getBuns() < bunsRequired) {
            throw new RuntimeException("Not enough buns");
        }

        // Consume buns
        user.setBuns(user.getBuns() - bunsRequired);
        user.setBunsConsumedCount(user.getBunsConsumedCount() + bunsRequired);

        // Check for elite boss charge (every 1000 buns)
        if (user.getBunsConsumedCount() >= 1000) {
            int newCharges = user.getBunsConsumedCount() / 1000;
            user.setEliteBossCharges(Math.min(3, user.getEliteBossCharges() + newCharges));
            user.setBunsConsumedCount(user.getBunsConsumedCount() % 1000);
        }

        // Generate loot
        List<Equipment> droppedItems = lootService.generateLoot(user.getLootDropLevel(),
                user.getLevel(),
                user.getXMultiplier());

        // Save dropped items to database
        for (Equipment item : droppedItems) {
            equipmentRepository.save(item);
        }

        // Gain XP
        int xpGained = 10 * user.getXMultiplier();
        boolean leveledUp = cultivationService.addExperience(user, xpGained);

        userRepository.save(user);

        return new FightResponse(true, "Enemy defeated!", user, droppedItems,
                xpGained, user.getEliteBossCharges(),
                leveledUp ? "Level up!" : null);
    }

    public FightResponse fightEliteBoss(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEliteBossCharges() < 1) {
            throw new RuntimeException("No elite boss charges available");
        }

        if (user.getBuns() < 15) {
            throw new RuntimeException("Not enough buns");
        }

        // Consume resources
        user.setEliteBossCharges(user.getEliteBossCharges() - 1);
        user.setBuns(user.getBuns() - 15);

        // Generate guaranteed high-tier loot (15 items)
        List<Equipment> droppedItems = lootService.generateEliteBossLoot(
                user.getLootDropLevel(), user.getLevel());

        // Save dropped items
        for (Equipment item : droppedItems) {
            equipmentRepository.save(item);
        }

        // Gain XP
        int xpGained = 150; // Elite boss gives more XP
        boolean leveledUp = cultivationService.addExperience(user, xpGained);

        userRepository.save(user);

        return new FightResponse(true, "Elite boss defeated!", user, droppedItems,
                xpGained, user.getEliteBossCharges(),
                leveledUp ? "Level up!" : null);
    }

    public GameResponse equipItem(String userId, EquipItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Equipment newItem = equipmentRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Check if there's an existing item in this slot
        Equipment oldItem = user.getEquippedItems().get(newItem.getType());

        // Equip new item
        user.getEquippedItems().put(newItem.getType(), newItem);

        // If replacing an item, sell the old one automatically
        if (oldItem != null) {
            user.setSilverCoins(user.getSilverCoins() + oldItem.getSellValue());
            equipmentRepository.deleteById(oldItem.getId());
        }

        // Recalculate stats
        recalculateUserStats(user);

        userRepository.save(user);
        equipmentRepository.deleteById(newItem.getId()); // Remove from available pool

        return new GameResponse(true, "Item equipped successfully", user);
    }

    public GameResponse sellItem(String userId, String itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Equipment item = equipmentRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        user.setSilverCoins(user.getSilverCoins() + item.getSellValue());
        equipmentRepository.deleteById(itemId);
        userRepository.save(user);

        return new GameResponse(true, "Item sold for " + item.getSellValue() + " silver coins", user);
    }

    public GameResponse attemptBreakthrough(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCurrentXp() < user.getXpToNextLevel()) {
            throw new RuntimeException("Not enough XP for breakthrough");
        }

        boolean success = cultivationService.attemptBreakthrough(user);
        userRepository.save(user);

        String message = success ?
                "Breakthrough successful! Entered " + user.getCultivationRealm() :
                "Breakthrough failed. Lost 20% XP.";

        return new GameResponse(true, message, user);
    }

    public GameResponse upgradeLootLevel(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long cost = calculateLootLevelUpgradeCost(user.getLootDropLevel());

        if (user.getSilverCoins() < cost) {
            throw new RuntimeException("Not enough silver coins");
        }

        user.setSilverCoins(user.getSilverCoins() - cost);
        user.setLootDropLevel(user.getLootDropLevel() + 1);

        userRepository.save(user);

        return new GameResponse(true, "Loot level upgraded to " + user.getLootDropLevel(), user);
    }

    public GameResponse getUserStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new GameResponse(true, "User stats retrieved", user);
    }

    private void recalculateUserStats(User user) {
        // Base stats
        int baseHealth = 100;
        int baseAttack = 10;
        int baseDefense = 10;
        int baseSpeed = 10;
        int powerRating = 0;

        // Add equipment bonuses
        for (Equipment item : user.getEquippedItems().values()) {
            baseHealth += item.getHealthBonus();
            baseAttack += item.getAttackBonus();
            baseDefense += item.getDefenseBonus();
            baseSpeed += item.getSpeedBonus();
            powerRating += item.getPowerRatingBonus();
        }

        // Add level bonuses
        int levelMultiplier = user.getLevel();
        baseHealth += levelMultiplier * 5;
        baseAttack += levelMultiplier * 2;
        baseDefense += levelMultiplier * 2;
        baseSpeed += levelMultiplier * 1;

        user.setHealth(baseHealth);
        user.setAttack(baseAttack);
        user.setDefense(baseDefense);
        user.setSpeed(baseSpeed);
        user.setPowerRating(powerRating + (levelMultiplier * 10));
    }

    private long calculateLootLevelUpgradeCost(int currentLevel) {
        return (long) (1000 * Math.pow(1.5, currentLevel - 1));
    }
}