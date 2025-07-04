// src/components/game/modals/EquipmentDetailsModal.jsx
import "./EquipmentDetailsModal.css";

function EquipmentDetailsModal({ equipment }) {
  if (!equipment) return null;

  return (
    <div className="equipment-details">
      <div className="equipment-header">
        <h3 style={{ color: equipment.color }}>{equipment.name}</h3>
        <div className="equipment-tier" style={{ color: equipment.color }}>
          {equipment.tier}
        </div>
      </div>

      <div className="equipment-stats">
        <div className="stat-row">
          <span>类型:</span>
          <span>{equipment.type}</span>
        </div>
        <div className="stat-row">
          <span>等级:</span>
          <span>{equipment.level}</span>
        </div>
        <div className="stat-row">
          <span>攻击:</span>
          <span className="stat-bonus">+{equipment.attackBonus}</span>
        </div>
        <div className="stat-row">
          <span>防御:</span>
          <span className="stat-bonus">+{equipment.defenseBonus}</span>
        </div>
        <div className="stat-row">
          <span>生命:</span>
          <span className="stat-bonus">+{equipment.healthBonus}</span>
        </div>
        <div className="stat-row">
          <span>速度:</span>
          <span className="stat-bonus">+{equipment.speedBonus}</span>
        </div>
        <div className="stat-row total-power">
          <span>战力:</span>
          <span className="power-value">+{equipment.powerRatingBonus}</span>
        </div>
      </div>

      <div className="equipment-value">
        <div className="sell-value">出售价值: {equipment.sellValue} 银币</div>
      </div>
    </div>
  );
}

export default EquipmentDetailsModal;
