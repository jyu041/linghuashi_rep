// src/components/game/modals/LootModal.jsx
import { useState } from "react";
import styles from "./LootModal.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../../utils/tierColors";

function LootModal({ items, onClose, onEquip, onCompare, user }) {
  const [selectedItems, setSelectedItems] = useState([]);

  // Equipment type to icon mapping
  const getEquipmentIcon = (type) => {
    const iconMap = {
      武器: "⚔️",
      头部: "🎩",
      身体: "👕",
      脚部: "👢",
      腰部: "👔",
      护臂: "🛡️",
      戒指: "💍",
      手部: "🧤",
      腿部: "👖",
      项链: "📿",
      护身符: "🔮",
      暗器: "🗡️",
    };
    return iconMap[type] || "⚡";
  };

  // Calculate total power rating of an item
  const calculateItemPower = (item) => {
    let power = 0;
    if (item.healthBonus) power += item.healthBonus * 0.5;
    if (item.attackBonus) power += item.attackBonus * 2;
    if (item.defenseBonus) power += item.defenseBonus * 1.5;
    if (item.speedBonus) power += item.speedBonus * 1;
    if (item.powerRatingBonus) power += item.powerRatingBonus;
    return Math.floor(power);
  };

  // Check if new item is better than currently equipped item
  const isItemUpgrade = (newItem) => {
    if (!user?.equippedItems) return false;

    const currentItem = user.equippedItems[newItem.type];
    if (!currentItem) return true; // No item equipped, so any item is an upgrade

    const newPower = calculateItemPower(newItem);
    const currentPower = calculateItemPower(currentItem);
    return newPower > currentPower;
  };

  const handleItemClick = (item) => {
    // Single click opens comparison modal
    onCompare([item, user?.equippedItems?.[item.type]].filter(Boolean));
  };

  const handleEquip = (item, event) => {
    event.stopPropagation();
    onEquip(item);
    onClose();
  };

  if (!items || items.length === 0) {
    return (
      <div className={styles.lootModal}>
        <h3 className={styles.modalTitle}>战利品</h3>
        <p className={styles.noItemsMessage}>没有获得任何战利品</p>
        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    );
  }

  return (
    <div className={styles.lootModal}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>战利品 ({items.length}件)</h3>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.lootItemBox}
            onClick={() => handleItemClick(item)}
          >
            {/* Tier background with gradient support */}
            <div
              className={styles.tierBackground}
              style={getTierBackgroundStyle(item.tier)}
            >
              {/* Tier name in background */}
              <div className={styles.tierNameBackground}>
                {getTierDisplayName(item.tier)}
              </div>
            </div>

            {/* Item name above icon */}
            <div className={styles.itemName}>{item.name}</div>

            {/* Large equipment icon */}
            <div className={styles.equipmentIcon}>
              {getEquipmentIcon(item.type)}
            </div>

            {/* Power upgrade indicator */}
            {isItemUpgrade(item) && (
              <div className={styles.upgradeIndicator}>
                <span className={styles.upgradeArrow}>↗️</span>
              </div>
            )}

            {/* Quick equip button */}
            <button
              className={styles.quickEquipBtn}
              onClick={(e) => handleEquip(item, e)}
              title="快速装备"
            >
              装备
            </button>
          </div>
        ))}
      </div>

      <div className={styles.modalFooter}>
        <div className={styles.instructions}>
          点击物品查看详细对比 • 绿色箭头表示战力提升
        </div>
      </div>
    </div>
  );
}

export default LootModal;
