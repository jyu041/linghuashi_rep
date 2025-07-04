// src/components/game/modals/LootModal.jsx
import "./LootModal.css";

function LootModal({ selectedItems, onEquipItem, onSellItem }) {
  return (
    <div className="loot-content">
      <div className="loot-grid">
        {selectedItems.map((item, index) => (
          <div
            key={index}
            className="loot-item"
            style={{ borderColor: item.color }}
          >
            <div className="item-name" style={{ color: item.color }}>
              {item.name}
            </div>
            <div className="item-stats">
              <div>等级: {item.level}</div>
              <div>攻击: +{item.attackBonus}</div>
              <div>防御: +{item.defenseBonus}</div>
              <div>生命: +{item.healthBonus}</div>
              <div>速度: +{item.speedBonus}</div>
            </div>
            <div className="item-actions">
              <button className="equip-btn" onClick={() => onEquipItem(item)}>
                装备
              </button>
              <button className="sell-btn" onClick={() => onSellItem(item)}>
                出售 ({item.sellValue}银币)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LootModal;
