// src/components/game/modals/ItemCompareModal.jsx
import styles from "./ItemCompareModal.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../../utils/tierColors";

function ItemCompareModal({ items, onClose }) {
  if (!items || items.length < 2) {
    return (
      <div className={styles.itemCompareModal}>
        <h3 className={styles.modalTitle}>装备对比</h3>
        <p className={styles.errorMessage}>需要至少2件装备进行对比</p>
        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    );
  }

  const getAllStats = () => {
    const allStats = new Set();
    items.forEach((item) => {
      if (item.stats) {
        Object.keys(item.stats).forEach((stat) => allStats.add(stat));
      }
    });
    return Array.from(allStats);
  };

  const getStatValue = (item, stat) => {
    return item.stats?.[stat] || 0;
  };

  const getBestStatValue = (stat) => {
    return Math.max(...items.map((item) => getStatValue(item, stat)));
  };

  const allStats = getAllStats();

  return (
    <div className={styles.itemCompareModal}>
      <h3 className={styles.modalTitle}>装备对比</h3>

      <div className={styles.compareContainer}>
        {/* Items Header */}
        <div className={styles.itemsHeader}>
          <div className={styles.statColumn}></div>
          {items.map((item, index) => (
            <div key={index} className={styles.itemColumn}>
              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <div
                  className={styles.itemTier}
                  style={getTierBackgroundStyle(item.tier)}
                >
                  {getTierDisplayName(item.tier)}
                </div>
                <div className={styles.itemType}>{item.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Comparison */}
        <div className={styles.statsComparison}>
          {allStats.map((stat) => {
            const bestValue = getBestStatValue(stat);
            return (
              <div key={stat} className={styles.statRow}>
                <div className={styles.statName}>{stat}</div>
                {items.map((item, index) => {
                  const value = getStatValue(item, stat);
                  const isBest = value === bestValue && value > 0;
                  return (
                    <div
                      key={index}
                      className={`${styles.statValue} ${
                        isBest ? styles.bestStat : ""
                      }`}
                    >
                      {value > 0 ? `+${value}` : "-"}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Special Effects */}
        <div className={styles.specialEffectsSection}>
          <h4 className={styles.sectionTitle}>特殊效果</h4>
          <div className={styles.effectsComparison}>
            <div className={styles.statColumn}></div>
            {items.map((item, index) => (
              <div key={index} className={styles.itemColumn}>
                {item.specialEffects && item.specialEffects.length > 0 ? (
                  item.specialEffects.map((effect, effectIndex) => (
                    <div key={effectIndex} className={styles.specialEffect}>
                      {effect}
                    </div>
                  ))
                ) : (
                  <div className={styles.noEffects}>无特殊效果</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.modalActions}>
        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}

export default ItemCompareModal;
