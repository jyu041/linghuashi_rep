// src/components/game/modals/ItemCompareModal.jsx
import "./ItemCompareModal.css";

function ItemCompareModal({ newItem, currentItem, onEquip, onSell }) {
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

  const powerDifference =
    newItem.powerRatingBonus - currentItem.powerRatingBonus;
  const isUpgrade = powerDifference > 0;

  const StatComparison = ({ label, newValue, currentValue }) => {
    const diff = newValue - currentValue;
    return (
      <div className="stat-comparison">
        <span className="stat-label">{label}:</span>
        <div className="stat-values">
          <span className="current-value">{currentValue}</span>
          <span className="arrow">→</span>
          <span
            className={`new-value ${
              diff > 0 ? "upgrade" : diff < 0 ? "downgrade" : "same"
            }`}
          >
            {newValue}
          </span>
          {diff !== 0 && (
            <span className={`diff ${diff > 0 ? "positive" : "negative"}`}>
              ({diff > 0 ? "+" : ""}
              {diff})
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="item-compare-content">
      <h3 className="compare-title">装备对比</h3>

      <div className="items-comparison">
        {/* Current Item */}
        <div className="item-section">
          <h4 className="section-title">当前装备</h4>
          <div className="item-card">
            <div
              className="item-tier-badge"
              style={{ backgroundColor: getTierColor(currentItem.tier) }}
            >
              {currentItem.tier}
            </div>
            <div className="item-name">{currentItem.name}</div>
            <div className="item-level">等级: {currentItem.level}</div>
            <div className="item-stats">
              <div>攻击: +{currentItem.attackBonus}</div>
              <div>防御: +{currentItem.defenseBonus}</div>
              <div>生命: +{currentItem.healthBonus}</div>
              <div>速度: +{currentItem.speedBonus}</div>
              <div className="power-rating">
                战力: +{currentItem.powerRatingBonus}
              </div>
            </div>
          </div>
        </div>

        {/* New Item */}
        <div className="item-section">
          <h4 className="section-title">新装备</h4>
          <div className="item-card">
            <div
              className="item-tier-badge"
              style={{ backgroundColor: getTierColor(newItem.tier) }}
            >
              {newItem.tier}
            </div>
            <div className="item-name">{newItem.name}</div>
            <div className="item-level">等级: {newItem.level}</div>
            <div className="item-stats">
              <div>攻击: +{newItem.attackBonus}</div>
              <div>防御: +{newItem.defenseBonus}</div>
              <div>生命: +{newItem.healthBonus}</div>
              <div>速度: +{newItem.speedBonus}</div>
              <div className="power-rating">
                战力: +{newItem.powerRatingBonus}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="detailed-comparison">
        <h4>属性变化</h4>
        <StatComparison
          label="攻击"
          newValue={newItem.attackBonus}
          currentValue={currentItem.attackBonus}
        />
        <StatComparison
          label="防御"
          newValue={newItem.defenseBonus}
          currentValue={currentItem.defenseBonus}
        />
        <StatComparison
          label="生命"
          newValue={newItem.healthBonus}
          currentValue={currentItem.healthBonus}
        />
        <StatComparison
          label="速度"
          newValue={newItem.speedBonus}
          currentValue={currentItem.speedBonus}
        />
        <div className="power-comparison">
          <span className="power-label">总战力变化:</span>
          <span
            className={`power-change ${isUpgrade ? "upgrade" : "downgrade"}`}
          >
            {isUpgrade ? "+" : ""}
            {powerDifference}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className={`equip-btn ${isUpgrade ? "upgrade" : "downgrade"}`}
          onClick={onEquip}
        >
          {isUpgrade ? "装备升级" : "装备替换"}
          {isUpgrade && "⬆️"}
        </button>
        <button className="sell-btn" onClick={onSell}>
          出售新装备 ({newItem.sellValue} 银币)
        </button>
      </div>
    </div>
  );
}

export default ItemCompareModal;
