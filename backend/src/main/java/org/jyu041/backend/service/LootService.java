// backend/src/main/java/org/jyu041/backend/service/LootService.java
package org.jyu041.backend.service;

import org.jyu041.backend.entity.Equipment;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LootService {

    private static final String[] EQUIPMENT_TYPES = {
            "武器", "头部", "身体", "脚部", "腰部", "护臂",
            "戒指", "手部", "腿部", "项链", "护身符", "暗器"
    };

    private static final Map<String, String> TIER_COLORS = Map.ofEntries(
            Map.entry("凡品", "#808080"),
            Map.entry("良品", "#008000"),
            Map.entry("上品", "#008B8B"),
            Map.entry("极品", "#DDA0DD"),
            Map.entry("灵品", "#FFFF00"),
            Map.entry("王品", "#FFA500"),
            Map.entry("圣品", "#FF0000"),
            Map.entry("帝品", "#FFC0CB"),
            Map.entry("帝品.精", "linear-gradient(45deg, #800080, #0000FF)"),
            Map.entry("帝品.珍", "linear-gradient(45deg, #006400, #90EE90)"),
            Map.entry("帝品.极", "linear-gradient(45deg, #00008B, #ADD8E6)"),
            Map.entry("帝品.绝", "linear-gradient(45deg, #4B0082, #DDA0DD)"),
            Map.entry("仙品.精", "linear-gradient(45deg, #B8860B, #FFD700)"),
            Map.entry("仙品.极", "linear-gradient(45deg, #8B0000, #FFB6C1)")
    );

    public List<Equipment> generateLoot(int lootDropLevel, int userLevel, int quantity) {
        List<Equipment> loot = new ArrayList<>();

        for (int i = 0; i < quantity; i++) {
            String tier = determineLootTier(lootDropLevel);
            String type = EQUIPMENT_TYPES[(int) (Math.random() * EQUIPMENT_TYPES.length)];
            int itemLevel = userLevel + (int) (Math.random() * 7) - 3; // -3 to +3
            itemLevel = Math.max(1, itemLevel);

            Equipment item = new Equipment(
                    generateItemName(type, tier),
                    type,
                    tier,
                    TIER_COLORS.get(tier),
                    itemLevel
            );

            loot.add(item);
        }

        return loot;
    }

    public List<Equipment> generateEliteBossLoot(int lootDropLevel, int userLevel) {
        List<Equipment> loot = new ArrayList<>();
        String guaranteedTier = getHighestAvailableTier(lootDropLevel);

        // First item is guaranteed highest tier
        String type = EQUIPMENT_TYPES[(int) (Math.random() * EQUIPMENT_TYPES.length)];
        int itemLevel = userLevel + (int) (Math.random() * 7) - 3;
        itemLevel = Math.max(1, itemLevel);

        Equipment guaranteedItem = new Equipment(
                generateItemName(type, guaranteedTier),
                type,
                guaranteedTier,
                TIER_COLORS.get(guaranteedTier),
                itemLevel
        );
        loot.add(guaranteedItem);

        // Generate 14 more items with normal drop rates
        loot.addAll(generateLoot(lootDropLevel, userLevel, 14));

        return loot;
    }

    private String determineLootTier(int lootDropLevel) {
        double random = Math.random() * 100;
        Map<String, Double> dropRates = calculateDropRates(lootDropLevel);

        double cumulative = 0;
        for (Map.Entry<String, Double> entry : dropRates.entrySet()) {
            cumulative += entry.getValue();
            if (random <= cumulative) {
                return entry.getKey();
            }
        }

        return "凡品"; // Fallback
    }

    public Map<String, Double> calculateDropRates(int level) {
        Map<String, Double> rates = new LinkedHashMap<>();

        if (level == 1) {
            rates.put("凡品", 69.0);
            rates.put("良品", 20.0);
            rates.put("上品", 10.0);
            rates.put("极品", 1.0);
        } else if (level == 2) {
            rates.put("凡品", 53.99);
            rates.put("良品", 25.0);
            rates.put("上品", 18.0);
            rates.put("极品", 2.81);
            rates.put("灵品", 0.2);
        } else if (level <= 12) {
            // Progressive scaling from level 3 to 12
            double factor = (level - 2.0) / 10.0; // 0.1 to 1.0
            rates.put("凡品", Math.max(0, 53.99 * (1 - factor)));
            rates.put("良品", Math.max(0, 25.0 - factor * 15));
            rates.put("上品", Math.max(0, 18.0 - factor * 8));
            rates.put("极品", 2.81 + factor * 5);
            rates.put("灵品", 0.2 + factor * 25);
            if (factor > 0.3) {
                rates.put("王品", (factor - 0.3) * 35);
            }
            if (factor > 0.6) {
                rates.put("圣品", (factor - 0.6) * 15);
            }
            if (factor > 0.8) {
                rates.put("帝品", (factor - 0.8) * 10);
            }
        } else if (level == 13) {
            rates.put("灵品", 53.39);
            rates.put("王品", 30.10);
            rates.put("圣品", 9.22);
            rates.put("帝品", 4.61);
            rates.put("帝品.精", 2.00);
            rates.put("帝品.珍", 0.59);
            rates.put("帝品.极", 0.08);
            rates.put("帝品.绝", 0.01);
        } else if (level == 14) {
            rates.put("王品", 53.40);
            rates.put("圣品", 29.65);
            rates.put("帝品", 9.44);
            rates.put("帝品.精", 4.98);
            rates.put("帝品.珍", 1.86);
            rates.put("帝品.极", 0.58);
            rates.put("帝品.绝", 0.08);
            rates.put("仙品.精", 0.01);
        } else if (level >= 15) {
            // Infinite scaling system for levels 15+
            double baseShift = (level - 14) * 0.1; // Each level shifts rates
            double rareTierBoost = Math.log(level - 13) * 0.5; // Logarithmic boost for rare tiers

            if (level < 20) {
                rates.put("王品", Math.max(0, 53.40 - baseShift * 100));
                rates.put("圣品", 29.65 + baseShift * 50);
                rates.put("帝品", 9.44 + baseShift * 30);
                rates.put("帝品.精", 4.98 + baseShift * 15);
                rates.put("帝品.珍", 1.86 + baseShift * 8);
                rates.put("帝品.极", 0.58 + baseShift * 4);
                rates.put("帝品.绝", 0.08 + baseShift * 2);
                rates.put("仙品.精", 0.01 + baseShift * 1);
                if (level >= 18) {
                    rates.put("仙品.极", (level - 17) * 0.01);
                }
            } else {
                // Advanced infinite scaling for level 20+
                double advancedFactor = Math.pow(1.02, level - 20); // Exponential growth
                rates.put("圣品", Math.max(5, 40 - baseShift * 20));
                rates.put("帝品", Math.max(10, 25 + rareTierBoost * 5));
                rates.put("帝品.精", Math.max(8, 15 + rareTierBoost * 3));
                rates.put("帝品.珍", Math.max(6, 10 + rareTierBoost * 2));
                rates.put("帝品.极", Math.max(4, 7 + rareTierBoost * 1.5));
                rates.put("帝品.绝", Math.max(2, 2.5 + rareTierBoost));
                rates.put("仙品.精", Math.max(1, 0.4 + rareTierBoost * 0.5));
                rates.put("仙品.极", Math.max(0.1, 0.1 + (level - 20) * 0.05 * advancedFactor));
            }
        }

        return rates;
    }

    private String getHighestAvailableTier(int lootDropLevel) {
        Map<String, Double> rates = calculateDropRates(lootDropLevel);
        String highestTier = "凡品";

        String[] tierOrder = {"凡品", "良品", "上品", "极品", "灵品", "王品", "圣品",
                "帝品", "帝品.精", "帝品.珍", "帝品.极", "帝品.绝",
                "仙品.精", "仙品.极"};

        for (int i = tierOrder.length - 1; i >= 0; i--) {
            if (rates.containsKey(tierOrder[i]) && rates.get(tierOrder[i]) > 0) {
                return tierOrder[i];
            }
        }

        return highestTier;
    }

    private String generateItemName(String type, String tier) {
        String[] prefixes = {"神秘的", "强化的", "精制的", "传说的", "史诗的", "神圣的", "不朽的"};
        String[] suffixes = {"之力", "之怒", "之光", "之影", "之心", "之魂", "之灵"};

        String prefix = prefixes[(int) (Math.random() * prefixes.length)];
        String suffix = suffixes[(int) (Math.random() * suffixes.length)];

        return prefix + type + suffix;
    }
}