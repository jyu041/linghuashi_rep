// src/components/game/modals/EquipmentDetailsModal.jsx
import styles from "./EquipmentDetailsModal.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../../utils/tierColors";

function EquipmentDetailsModal({ equipment, onClose }) {
  if (!equipment) return null;

  return (
    <div className={styles.equipmentDetailsModal}>
      <div className={styles.equipmentHeader}>
        <h3 className={styles.equipmentName}>{equipment.name}</h3>
        <div
          className={styles.equipmentTier}
          style={getTierBackgroundStyle(equipment.tier)}
        >
          {getTierDisplayName(equipment.tier)}
        </div>
      </div>

      <div className={styles.equipmentStats}>
        <div className={styles.statGroup}>
          <h4 className={styles.statGroupTitle}>基础属性</h4>
          {equipment.stats &&
            Object.entries(equipment.stats).map(([stat, value]) => (
              <div key={stat} className={styles.statItem}>
                <span className={styles.statName}>{stat}</span>
                <span className={styles.statValue}>+{value}</span>
              </div>
            ))}
        </div>

        {equipment.specialEffects && equipment.specialEffects.length > 0 && (
          <div className={styles.statGroup}>
            <h4 className={styles.statGroupTitle}>特殊效果</h4>
            {equipment.specialEffects.map((effect, index) => (
              <div key={index} className={styles.specialEffect}>
                {effect}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.equipmentInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>类型:</span>
          <span className={styles.infoValue}>{equipment.type}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>等级要求:</span>
          <span className={styles.infoValue}>
            {equipment.levelRequirement || 1}
          </span>
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

export default EquipmentDetailsModal;
