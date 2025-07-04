// src/components/game/modals/LootLevelModal.jsx
import { useState } from "react";
import "./LootLevelModal.css";
import { formatChineseNumber } from "../../../utils/formatNumber";

function LootLevelModal({ user, onUpgrade, onUpgradeXMultiplier, onClose }) {
  const [activeTab, setActiveTab] = useState("dropRates");

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
    } else if (level <= 12) {
      const factor = (level - 2.0) / 10.0;
      rates["凡品"] = Math.max(0, 53.99 * (1 - factor));
      rates["良品"] = Math.max(0, 25.0 - factor * 15);
      rates["上品"] = Math.max(0, 18.0 - factor * 8);
      rates["极品"] = 2.81 + factor * 5;
      rates["灵品"] = 0.2 + factor * 25;
      if (factor > 0.3) {
        rates["王品"] = (factor - 0.3) * 35;
      }
      if (factor > 0.6) {
        rates["圣品"] = (factor - 0.6) * 15;
      }
      if (factor > 0.8) {
        rates["帝品"] = (factor - 0.8) * 10;
      }
    } else if (level === 13) {
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
      const baseShift = (level - 14) * 0.1;
      const rareTierBoost = Math.log(level - 13) * 0.5;

      if (level < 20) {
        rates["王品"] = Math.max(0, 53.4 - baseShift * 100);
        rates["圣品"] = 29.65 + baseShift * 50;
        rates["帝品"] = 9.44 + baseShift * 30;
        rates["帝品.精"] = 4.98 + baseShift * 15;
        rates["帝品.珍"] = 1.86 + baseShift * 8;
        rates["帝品.极"] = 0.58 + baseShift * 4;
        rates["帝品.绝"] = 0.08 + baseShift * 2;
        rates["仙品.精"] = 0.01 + baseShift * 1;
        if (level >= 18) {
          rates["仙品.极"] = (level - 17) * 0.01;
        }
      } else {
        const advancedFactor = Math.pow(1.02, level - 20);
        rates["圣品"] = Math.max(5, 40 - baseShift * 20);
        rates["帝品"] = Math.max(10, 25 + rareTierBoost * 5);
        rates["帝品.精"] = Math.max(8, 15 + rareTierBoost * 3);
        rates["帝品.珍"] = Math.max(6, 10 + rareTierBoost * 2);
        rates["帝品.极"] = Math.max(4, 7 + rareTierBoost * 1.5);
        rates["帝品.绝"] = Math.max(2, 2.5 + rareTierBoost);
        rates["仙品.精"] = Math.max(1, 0.4 + rareTierBoost * 0.5);
        rates["仙品.极"] = Math.max(
          0.1,
          0.1 + (level - 20) * 0.05 * advancedFactor
        );
      }
    }

    return rates;
  };

  const calculateUpgradeCost = (currentLevel) => {
    return Math.floor(1000 * Math.pow(1.5, currentLevel - 1));
  };

  const calculateXMultiplierCost = (currentMultiplier) => {
    return Math.floor(100 * Math.pow(2, currentMultiplier - 1));
  };

  const calculateRequiredLootLevel = (currentMultiplier) => {
    return Math.max(1, (currentMultiplier - 1) * 5);
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

  const xMultiplierCost = calculateXMultiplierCost(user.xMultiplier);
  const requiredLootLevel = calculateRequiredLootLevel(user.xMultiplier + 1);
  const canUpgradeXMultiplier = user.lootDropLevel >= requiredLootLevel;

  return (
    <div className="loot-level-content">
      <div className="loot-tabs">
        <button
          className={`tab-button ${activeTab === "dropRates" ? "active" : ""}`}
          onClick={() => setActiveTab("dropRates")}
        >
          掉落率升级
        </button>
        <button
          className={`tab-button ${
            activeTab === "xMultiplier" ? "active" : ""
          }`}
          onClick={() => setActiveTab("xMultiplier")}
        >
          倍数升级
        </button>
      </div>

      {activeTab === "dropRates" && (
        <div className="drop-rates-tab">
          <div className="current-level-section">
            <h4>当前等级 {user.lootDropLevel} 掉落率:</h4>
            <div className="drop-rates">
              {Object.entries(currentRates).map(([tier, rate]) => (
                <div key={tier} className="rate-item">
                  <span
                    className="tier-name"
                    style={{ color: getTierColor(tier) }}
                  >
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
                  <span
                    className="tier-name"
                    style={{ color: getTierColor(tier) }}
                  >
                    {tier}
                  </span>
                  <span className="rate-value">{rate.toFixed(2)}%</span>
                  {!currentRates[tier] && <span className="new-tier">新!</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="upgrade-cost">
            <p>升级费用: {formatChineseNumber(upgradeCost)} 银币</p>
            <p>你的银币: {formatChineseNumber(user.silverCoins)}</p>
          </div>

          <div className="modal-buttons">
            <button
              className="upgrade-btn"
              onClick={onUpgrade}
              disabled={user.silverCoins < upgradeCost}
            >
              升级 ({formatChineseNumber(upgradeCost)} 银币)
            </button>
            <button className="cancel-btn" onClick={onClose}>
              取消
            </button>
          </div>
        </div>
      )}

      {activeTab === "xMultiplier" && (
        <div className="x-multiplier-tab">
          <div className="current-multiplier-section">
            <h4>当前倍数: {user.xMultiplier}倍</h4>
            <p>每次战斗获得 {user.xMultiplier} 个掉落物品</p>
            <p>每次战斗消耗 {user.xMultiplier} 个包子</p>
            <p>每次战斗获得 {user.xMultiplier * 10} 经验</p>
          </div>

          <div className="next-multiplier-section">
            <h4>升级到 {user.xMultiplier + 1}倍:</h4>
            <p>每次战斗获得 {user.xMultiplier + 1} 个掉落物品</p>
            <p>每次战斗消耗 {user.xMultiplier + 1} 个包子</p>
            <p>每次战斗获得 {(user.xMultiplier + 1) * 10} 经验</p>
          </div>

          <div className="upgrade-requirements">
            <h4>升级要求:</h4>
            <div className="requirement-item">
              <span>掉落等级:</span>
              <span
                className={
                  user.lootDropLevel >= requiredLootLevel
                    ? "requirement-met"
                    : "requirement-not-met"
                }
              >
                {user.lootDropLevel} / {requiredLootLevel}
              </span>
            </div>
            <div className="requirement-item">
              <span>元宝:</span>
              <span
                className={
                  user.goldCoins >= xMultiplierCost
                    ? "requirement-met"
                    : "requirement-not-met"
                }
              >
                {user.goldCoins} / {xMultiplierCost}
              </span>
            </div>
          </div>

          <div className="modal-buttons">
            <button
              className="upgrade-btn"
              onClick={onUpgradeXMultiplier}
              disabled={
                !canUpgradeXMultiplier || user.goldCoins < xMultiplierCost
              }
            >
              升级 ({xMultiplierCost} 元宝)
            </button>
            <button className="cancel-btn" onClick={onClose}>
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LootLevelModal;
