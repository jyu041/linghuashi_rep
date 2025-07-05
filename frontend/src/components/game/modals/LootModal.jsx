// src/components/game/modals/LootModal.jsx
import { useState } from "react";
import styles from "./LootModal.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../../utils/tierColors";

function LootModal({ items, onClose, onEquip, onCompare }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleCompare = () => {
    if (selectedItems.length === 2) {
      onCompare(selectedItems);
    }
  };

  const handleEquip = (item) => {
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
        <div className={styles.headerActions}>
          {selectedItems.length === 2 && (
            <button className={styles.compareButton} onClick={handleCompare}>
              对比装备
            </button>
          )}
          <button className={styles.closeButton} onClick={onClose}>
            关闭
          </button>
        </div>
      </div>

      <div className={styles.itemsGrid}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.lootItem} ${
              selectedItems.includes(item) ? styles.selected : ""
            }`}
            onClick={() => handleItemSelect(item)}
          >
            <div
              className={styles.itemTier}
              style={getTierBackgroundStyle(item.tier)}
            >
              {getTierDisplayName(item.tier)}
            </div>

            <div className={styles.itemInfo}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <div className={styles.itemType}>{item.type}</div>

              {item.stats && (
                <div className={styles.itemStats}>
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <div key={stat} className={styles.statLine}>
                      <span className={styles.statName}>{stat}</span>
                      <span className={styles.statValue}>+{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.specialEffects && item.specialEffects.length > 0 && (
                <div className={styles.specialEffects}>
                  {item.specialEffects.map((effect, effectIndex) => (
                    <div key={effectIndex} className={styles.specialEffect}>
                      {effect}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.itemActions}>
              <button
                className={styles.equipButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEquip(item);
                }}
              >
                装备
              </button>
              <div className={styles.levelRequirement}>
                需要等级: {item.levelRequirement || 1}
              </div>
            </div>

            {selectedItems.includes(item) && (
              <div className={styles.selectedIndicator}>已选择</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.modalFooter}>
        <div className={styles.instructions}>
          点击装备进行选择，选择2件装备可进行对比
        </div>
        <div className={styles.selectionCount}>
          已选择: {selectedItems.length}/2
        </div>
      </div>
    </div>
  );
}

export default LootModal;
