// src/components/game/modals/LootModal.jsx
import React, { useEffect } from "react";
import "./LootModal.css";

function LootModal({
  selectedItems,
  user,
  onEquipItem,
  onSellItem,
  onSellAll,
}) {
  const getTierColor = (tier) => {
    const colors = {
      凡品: "#808080",
      良品: "#008000",
      上品: "#008B8B",
      极品: "#DDA0DD",
      灵品: "#FFFF00",
      王品: "#FFA500",
      圣品: "#FF0000",
      帝品: "#FFC0CB",
      "帝品.精": "#800080",
      "帝品.珍": "#006400",
      "帝品.极": "#00008B",
      "帝品.绝": "#4B0082",
      "仙品.精": "#B8860B",
      "仙品.极": "#8B0000",
    };
    return colors[tier] || "#808080";
  };

  const getEquipmentIcon = (type) => {
    const icons = {
      武器: "⚔️",
      头部: "👑",
      身体: "👔",
      脚部: "👢",
      腰部: "🔗",
      护臂: "🛡️",
      戒指: "💍",
      手部: "🧤",
      腿部: "👖",
      项链: "📿",
      护身符: "🔮",
      暗器: "🗡️",
    };
    return icons[type] || "📦";
  };

  const isPowerUpgrade = (item) => {
    const currentItem = user.equippedItems?.[item.type];
    if (!currentItem) return true; // New slot, always upgrade
    return item.powerRatingBonus > currentItem.powerRatingBonus;
  };

  const autoEquipNewItems = () => {
    // Auto-equip items for empty slots
    selectedItems.forEach((item) => {
      if (!user.equippedItems?.[item.type]) {
        onEquipItem(item);
      }
    });
  };

  // Auto-equip on mount if user has empty slots
  React.useEffect(() => {
    const hasEmptySlots = selectedItems.some(
      (item) => !user.equippedItems?.[item.type]
    );
    if (hasEmptySlots) {
      autoEquipNewItems();
    }
  }, []);

  return (
    <div className="loot-content">
      <div className="loot-header">
        <h3>战利品获得</h3>
        <button className="sell-all-btn" onClick={onSellAll}>
          全部出售
        </button>
      </div>

      <div className="loot-grid">
        {selectedItems.map((item, index) => (
          <div
            key={index}
            className="loot-item-card"
            onClick={() => (onEquipItem ? onEquipItem(item) : null)}
          >
            <div
              className="item-icon-container"
              style={{ backgroundColor: getTierColor(item.tier) }}
            >
              <div className="item-icon">{getEquipmentIcon(item.type)}</div>
              {isPowerUpgrade(item) && (
                <div className="upgrade-indicator">↗️</div>
              )}
            </div>

            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-level">Lv.{item.level}</div>
              <div className="item-power">战力 +{item.powerRatingBonus}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedItems.length === 0 && (
        <div className="no-items">
          <p>所有物品已处理完毕</p>
        </div>
      )}
    </div>
  );
}

export default LootModal;
