// backend/src/main/java/org/jyu041/backend/service/CultivationService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.User;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CultivationService {

    private static final Map<String, int[]> CULTIVATION_REALMS = Map.of(
            "凝气", new int[]{1, 40},
            "筑基", new int[]{41, 80},
            "结丹", new int[]{81, 120},
            "元婴", new int[]{121, 160},
            "化神", new int[]{161, 200},
            "婴变", new int[]{201, 240},
            "问鼎", new int[]{241, 280},
            "阴虚", new int[]{281, 320},
            "阳实", new int[]{321, 360}
    );

    public boolean addExperience(User user, long xpGained) {
        user.setCurrentXp(user.getCurrentXp() + xpGained);
        boolean leveledUp = false;

        while (user.getCurrentXp() >= user.getXpToNextLevel()) {
            if (isBreakthroughRequired(user.getLevel())) {
                // Stop gaining XP if breakthrough is required
                break;
            }

            user.setCurrentXp(user.getCurrentXp() - user.getXpToNextLevel());
            user.setLevel(user.getLevel() + 1);

            updateCultivationRealm(user);
            calculateNextLevelXp(user);
            leveledUp = true;
        }

        return leveledUp;
    }

    public boolean attemptBreakthrough(User user) {
        if (!isBreakthroughRequired(user.getLevel())) {
            throw new RuntimeException("No breakthrough required at this level");
        }

        double successRate = calculateBreakthroughSuccessRate(user.getLevel());
        boolean success = Math.random() < successRate;

        if (success) {
            // Successful breakthrough
            user.setCurrentXp(user.getCurrentXp() - user.getXpToNextLevel());
            user.setLevel(user.getLevel() + 1);
            updateCultivationRealm(user);
            calculateNextLevelXp(user);

            // Continue leveling if there's overflow XP
            while (user.getCurrentXp() >= user.getXpToNextLevel() &&
                    !isBreakthroughRequired(user.getLevel())) {
                user.setCurrentXp(user.getCurrentXp() - user.getXpToNextLevel());
                user.setLevel(user.getLevel() + 1);
                updateCultivationRealm(user);
                calculateNextLevelXp(user);
            }
        } else {
            // Failed breakthrough - lose 20% XP
            long lostXp = user.getCurrentXp() / 5; // 20%
            user.setCurrentXp(user.getCurrentXp() - lostXp);
        }

        return success;
    }

    private boolean isBreakthroughRequired(int level) {
        // Breakthrough required at levels: 10, 20, 30, 40, 80, 120, 160, 200, 240, 280, 320
        return (level % 10 == 0 && level <= 40) ||
                (level % 40 == 0 && level > 40);
    }

    private double calculateBreakthroughSuccessRate(int level) {
        // Higher levels have lower success rates
        double baseRate = 0.9; // 90% base success rate
        double levelPenalty = (level / 40.0) * 0.3; // Reduce by 30% per major realm
        return Math.max(0.1, baseRate - levelPenalty); // Minimum 10% success rate
    }

    private void updateCultivationRealm(User user) {
        int level = user.getLevel();
        String realm = "";
        String stage = "";

        for (Map.Entry<String, int[]> entry : CULTIVATION_REALMS.entrySet()) {
            int[] range = entry.getValue();
            if (level >= range[0] && level <= range[1]) {
                realm = entry.getKey();
                break;
            }
        }

        // Determine stage within realm
        int levelInRealm = level;
        for (Map.Entry<String, int[]> entry : CULTIVATION_REALMS.entrySet()) {
            int[] range = entry.getValue();
            if (level >= range[0] && level <= range[1]) {
                levelInRealm = level - range[0] + 1;
                break;
            }
        }

        if (levelInRealm <= 10) {
            stage = "前期";
        } else if (levelInRealm <= 20) {
            stage = "中期";
        } else if (levelInRealm <= 30) {
            stage = "后期";
        } else {
            stage = "圆满";
        }

        user.setCultivationRealm(realm + stage);
    }

    public void calculateNextLevelXp(User user) {
        int level = user.getLevel();
        long baseXp = 100;
        long incrementalXp = (level - 1) * 20;
        long majorBreakthroughXp = 0;

        // Add 500 XP for each major breakthrough (every 40 levels after level 40)
        if (level > 40) {
            majorBreakthroughXp = ((level - 1) / 40) * 500;
        }

        user.setXpToNextLevel(baseXp + incrementalXp + majorBreakthroughXp);
    }
}