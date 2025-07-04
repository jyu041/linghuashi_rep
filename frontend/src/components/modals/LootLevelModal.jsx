// src/components/game/modals/LootLevelModal.jsx
import "./LootLevelModal.css";

function LootLevelModal({ user, onUpgrade, onClose }) {
  const calculateDropRates = (level) => {
    const rates = {};

    if (level === 1) {
      rates["凡品"] = 69.0;
      rates["良品"] = 20.0;
      rates["上品"] = 10.0;
      rates["极品"] = 1.0;
    } else if (level === 2) {
      rates["凡品"] = 53.99;
      rates["良品"] = 25.0;
      rates["上品"] = 18.0;
      rates["极品"] = 2.81;
      rates["灵品"] = 0.2;
    } else if (level >= 13) {
      if (level === 13) {
        rates["灵品"] = 53.39;
        rates["王品"] = 30.1;
        rates["圣品"] = 9.22;
        rates["帝品"] = 4.61;
        rates["帝品.精"] = 2.0;
        rates["帝品.珍"] = 0.59;
        rates["帝品.极"] = 0.08;
        rates["帝品.绝"] = 0.01;
      } else if (level === 14) {
        rates["王品"] = 53.4;
        rates["圣品"] = 29.65;
        rates["帝品"] = 9.44;
        rates["帝品.精"] = 4.98;
        rates["帝品.珍"] = 1.86;
        rates["帝品.极"] = 0.58;
        rates["帝品.绝"] = 0.08;
        rates["仙品.精"] = 0.01;
      } else if (level >= 15) {
        rates["圣品"] = 40.0;
        rates["帝品"] = 25.0;
        rates["帝品.精"] = 15.0;
        rates["帝品.珍"] = 10.0;
        rates["帝品.极"] = 7.0;
        rates["帝品.绝"] = 2.5;
        rates["仙品.精"] = 0.4;
        rates["仙品.极"] = 0.1;
      }
    } else {
      const factor = (level - 2.0) / 11.0;
      rates["凡品"] = Math.max(0, 53.99 * (1 - factor));
      rates["良品"] = 25.0 + factor * 5;
      rates["上品"] = 18.0 + factor * 10;
      rates["极品"] = 2.81 + factor * 15;
      rates["灵品"] = 0.2 + factor * 53.19;
      if (factor > 0.5) {
        rates["王品"] = (factor - 0.5) * 60;
      }
    }

    return rates;
  };

  const calculateUpgradeCost = (currentLevel) => {
    return Math.floor(1000 * Math.pow(1.5, currentLevel - 1));
  };

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

  const currentRates = calculateDropRates(user.lootDropLevel);
  const nextRates = calculateDropRates(user.lootDropLevel + 1);
  const upgradeCost = calculateUpgradeCost(user.lootDropLevel);

  return (
    <div className="loot-level-content">
      <div className="current-level-section">
        <h4>当前等级 {user.lootDropLevel} 掉落率:</h4>
        <div className="drop-rates">
          {Object.entries(currentRates).map(([tier, rate]) => (
            <div key={tier} className="rate-item">
              <span className="tier-name" style={{ color: getTierColor(tier) }}>
                {tier}
              </span>
              <span className="rate-value">{rate.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="next-level-section">
        <h4>升级到等级 {user.lootDropLevel + 1} 掉落率:</h4>
        <div className="drop-rates">
          {Object.entries(nextRates).map(([tier, rate]) => (
            <div key={tier} className="rate-item">
              <span className="tier-name" style={{ color: getTierColor(tier) }}>
                {tier}
              </span>
              <span className="rate-value">{rate.toFixed(2)}%</span>
              {!currentRates[tier] && <span className="new-tier">新!</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="upgrade-cost">
        <p>升级费用: {upgradeCost} 银币</p>
        <p>你的银币: {user.silverCoins}</p>
      </div>

      <div className="modal-buttons">
        <button
          className="upgrade-btn"
          onClick={onUpgrade}
          disabled={user.silverCoins < upgradeCost}
        >
          升级 ({upgradeCost} 银币)
        </button>
        <button className="cancel-btn" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}

export default LootLevelModal;
