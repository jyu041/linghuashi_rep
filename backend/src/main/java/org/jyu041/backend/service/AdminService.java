// backend/src/main/java/org/jyu041/backend/service/AdminService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.User;
import org.jyu041.backend.dto.*;
import org.jyu041.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CultivationService cultivationService;

    public AdminStatsResponse getAdminStats() {
        List<User> allUsers = userRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", allUsers.size());
        stats.put("activeUsers", allUsers.stream()
                .filter(u -> u.getLastLoginAt() != null)
                .count());
        stats.put("averageLevel", allUsers.stream()
                .mapToInt(User::getLevel)
                .average()
                .orElse(0.0));
        stats.put("totalSilverCoins", allUsers.stream()
                .mapToLong(User::getSilverCoins)
                .sum());
        stats.put("totalGoldCoins", allUsers.stream()
                .mapToLong(User::getGoldCoins)
                .sum());
        stats.put("totalGodCoins", allUsers.stream()
                .mapToLong(User::getGodCoins)
                .sum());

        return new AdminStatsResponse(true, "Admin stats retrieved", stats);
    }

    public GameResponse manageUser(UserManagementRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (request.getAction()) {
            case "BAN":
                // Implement ban logic
                break;
            case "UNBAN":
                // Implement unban logic
                break;
            case "RESET":
                resetUser(user);
                break;
            default:
                throw new RuntimeException("Invalid action");
        }

        userRepository.save(user);
        return new GameResponse(true, "User management action completed", user);
    }

    public GameResponse giveCurrency(String targetUserId, String currencyType, long amount) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (currencyType.toLowerCase()) {
            case "silver":
                user.setSilverCoins(user.getSilverCoins() + amount);
                break;
            case "gold":
                user.setGoldCoins(user.getGoldCoins() + amount);
                break;
            case "god":
                user.setGodCoins(user.getGodCoins() + amount);
                break;
            default:
                throw new RuntimeException("Invalid currency type");
        }

        userRepository.save(user);
        return new GameResponse(true,
                "Gave " + amount + " " + currencyType + " coins to user", user);
    }

    public GameResponse setUserLevel(String targetUserId, int level) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (level < 1 || level > 360) {
            throw new RuntimeException("Invalid level range");
        }

        user.setLevel(level);
        user.setCurrentXp(0);

        // Update cultivation realm and XP requirements
        cultivationService.calculateNextLevelXp(user);
        updateCultivationRealm(user, level);

        userRepository.save(user);
        return new GameResponse(true, "User level set to " + level, user);
    }

    private void resetUser(User user) {
        user.setLevel(1);
        user.setCurrentXp(0);
        user.setXpToNextLevel(100);
        user.setCultivationRealm("凝气前期");
        user.setPowerRating(0);
        user.setLootDropLevel(1);
        user.setXMultiplier(1);
        user.setBuns(100);
        user.setEliteBossCharges(0);
        user.setBunsConsumedCount(0);
        user.setSilverCoins(1000);
        user.setGoldCoins(0);
        user.setGodCoins(0);
        user.getEquippedItems().clear();
        user.setHealth(100);
        user.setAttack(10);
        user.setDefense(10);
        user.setSpeed(10);
    }

    private void updateCultivationRealm(User user, int level) {
        String realm = "";
        String stage = "";

        if (level <= 40) realm = "凝气";
        else if (level <= 80) realm = "筑基";
        else if (level <= 120) realm = "结丹";
        else if (level <= 160) realm = "元婴";
        else if (level <= 200) realm = "化神";
        else if (level <= 240) realm = "婴变";
        else if (level <= 280) realm = "问鼎";
        else if (level <= 320) realm = "阴虚";
        else realm = "阳实";

        int levelInRealm = level % 40;
        if (levelInRealm == 0) levelInRealm = 40;

        if (levelInRealm <= 10) stage = "前期";
        else if (levelInRealm <= 20) stage = "中期";
        else if (levelInRealm <= 30) stage = "后期";
        else stage = "圆满";

        user.setCultivationRealm(realm + stage);
    }
}