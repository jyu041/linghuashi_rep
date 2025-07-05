// src/components/game/BottomNavigationArea3.jsx
import styles from "./BottomNavigationArea3.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../utils/tierColors";

function BottomNavigationArea3({ user, onEquipmentClick }) {
  const equipmentSlots = [
    // First row
    { key: "武器", name: "武器", icon: "⚔️" },
    { key: "头部", name: "头部", icon: "👑" },
    { key: "身体", name: "身体", icon: "👔" },
    { key: "脚部", name: "脚部", icon: "👢" },
    { key: "腰部", name: "腰部", icon: "🔗" },
    { key: "护臂", name: "护臂", icon: "🛡️" },
    // Second row
    { key: "戒指", name: "戒指", icon: "💍" },
    { key: "手部", name: "手部", icon: "🧤" },
    { key: "腿部", name: "腿部", icon: "👖" },
    { key: "项链", name: "项链", icon: "📿" },
    { key: "护身符", name: "护身符", icon: "🔮" },
    { key: "暗器", name: "暗器", icon: "🗡️" },
  ];

  const getEquippedItem = (slotKey) => {
    return user.equippedItems?.[slotKey];
  };

  return (
    <div className={`${styles.navArea} ${styles.area3}`}>
      <div className={styles.equipmentGrid}>
        {equipmentSlots.map((slot) => {
          const equippedItem = getEquippedItem(slot.key);
          return (
            <div
              key={slot.key}
              className={`${styles.equipmentSlot} ${
                equippedItem ? styles.equipped : styles.empty
              }`}
              onClick={() => equippedItem && onEquipmentClick(equippedItem)}
              title={slot.name}
            >
              {equippedItem ? (
                <div
                  className={styles.equippedItem}
                  style={{
                    ...getTierBackgroundStyle(equippedItem.tier),
                    borderColor:
                      getTierBackgroundStyle(equippedItem.tier)
                        .backgroundColor || "transparent",
                  }}
                >
                  <div className={styles.itemIcon}>{slot.icon}</div>
                  <div className={styles.itemTier}>
                    {getTierDisplayName(equippedItem.tier)}
                  </div>
                </div>
              ) : (
                <div className={styles.emptySlot}>
                  <div className={styles.slotIcon}>{slot.icon}</div>
                  <div className={styles.slotName}>{slot.name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavigationArea3;
