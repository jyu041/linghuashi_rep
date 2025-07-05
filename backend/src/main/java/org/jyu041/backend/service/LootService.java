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
            Map.entry("帝品.精", "linear-gradient(to right, #800080 0%, #0000FF 100%)"),
            Map.entry("帝品.珍", "linear-gradient(to right, #228B22 0%, #90EE90 100%)"),
            Map.entry("帝品.极", "linear-gradient(to right, #191970 0%, #87CEEB 100%)"),
            Map.entry("帝品.绝", "linear-gradient(to right, #4B0082 0%, #DDA0DD 100%)"),
            Map.entry("仙品.精", "linear-gradient(to right, #B8860B 0%, #FFD700 100%)"),
            Map.entry("仙品.极", "linear-gradient(to right, #8B0000 0%, #FFB6B6 100%)")
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
            rates.put("凡品", Math.max(0, 53.99 - factor * 53.99));
            rates.put("良品", Math.max(0, 25.0 - factor * 10.0));
            rates.put("上品", Math.max(0, 18.0 + factor * 5.0));
            rates.put("极品", Math.max(0, 2.81 + factor * 10.0));
            rates.put("灵品", Math.max(0, 0.2 + factor * 53.19));

            if (level >= 8) {
                rates.put("王品", factor * 30.1);
            }
            if (level >= 10) {
                rates.put("圣品", factor * 9.22);
            }
            if (level >= 11) {
                rates.put("帝品", factor * 4.61);
                rates.put("帝品.精", factor * 2.0);
            }
            if (level >= 12) {
                rates.put("帝品.珍", factor * 0.59);
                rates.put("帝品.极", factor * 0.08);
                rates.put("帝品.绝", factor * 0.01);
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
        } else if (level >= 14) {
            rates.put("王品", 53.40);
            rates.put("圣品", 29.65);
            rates.put("帝品", 9.44);
            rates.put("帝品.精", 4.98);
            rates.put("帝品.珍", 1.86);
            rates.put("帝品.极", 0.58);
            rates.put("帝品.绝", 0.08);
            rates.put("仙品.精", 0.01);

            if (level >= 15) {
                rates.put("仙品.极", 0.01);
            }
        }

        return rates;
    }

    private String getHighestAvailableTier(int lootDropLevel) {
        Map<String, Double> rates = calculateDropRates(lootDropLevel);
        return rates.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .max(Map.Entry.comparingByKey((tier1, tier2) -> {
                    List<String> tierOrder = Arrays.asList(
                            "凡品", "良品", "上品", "极品", "灵品", "王品", "圣品", "帝品",
                            "帝品.精", "帝品.珍", "帝品.极", "帝品.绝", "仙品.精", "仙品.极"
                    );
                    return Integer.compare(tierOrder.indexOf(tier1), tierOrder.indexOf(tier2));
                }))
                .map(Map.Entry::getKey)
                .orElse("凡品");
    }

    private String generateItemName(String type, String tier) {
        Map<String, String[]> nameTemplates = Map.ofEntries(
                Map.entry("武器", new String[]{"剑", "刀", "枪", "戟", "斧", "锤"}),
                Map.entry("头部", new String[]{"冠", "帽", "盔", "巾", "环", "箍"}),
                Map.entry("身体", new String[]{"袍", "甲", "衣", "服", "衫", "裳"}),
                Map.entry("脚部", new String[]{"靴", "鞋", "履", "屐", "蹬", "踏"}),
                Map.entry("腰部", new String[]{"带", "腰带", "绳", "链", "环", "扣"}),
                Map.entry("护臂", new String[]{"护臂", "臂甲", "护腕", "腕甲", "臂环", "护手"}),
                Map.entry("戒指", new String[]{"戒", "指环", "灵戒", "宝戒", "神戒", "仙戒"}),
                Map.entry("手部", new String[]{"手套", "护手", "手甲", "拳套", "指套", "腕套"}),
                Map.entry("腿部", new String[]{"护腿", "腿甲", "胫甲", "膝甲", "腿环", "护膝"}),
                Map.entry("项链", new String[]{"项链", "项圈", "颈环", "吊坠", "珠链", "神链"}),
                Map.entry("护身符", new String[]{"护身符", "符咒", "灵符", "宝符", "神符", "仙符"}),
                Map.entry("暗器", new String[]{"飞刀", "暗器", "毒针", "袖箭", "飞镖", "暗剑"})
        );

        String[] templates = nameTemplates.getOrDefault(type, new String[]{"装备"});
        String baseName = templates[(int) (Math.random() * templates.length)];

        String[] prefixes = {"破旧的", "普通的", "精良的", "稀有的", "史诗的", "传说的", "神话的", "不朽的", "至尊的", "神圣的", "混沌的", "终极的", "仙级的", "帝级的"};

        int tierIndex = getTierIndex(tier);
        String prefix = prefixes[Math.min(tierIndex, prefixes.length - 1)];

        return prefix + baseName;
    }

    private int getTierIndex(String tier) {
        return switch (tier) {
            case "凡品" -> 0;
            case "良品" -> 1;
            case "上品" -> 2;
            case "极品" -> 3;
            case "灵品" -> 4;
            case "王品" -> 5;
            case "圣品" -> 6;
            case "帝品" -> 7;
            case "帝品.精" -> 8;
            case "帝品.珍" -> 9;
            case "帝品.极" -> 10;
            case "帝品.绝" -> 11;
            case "仙品.精" -> 12;
            case "仙品.极" -> 13;
            default -> 0;
        };
    }
}