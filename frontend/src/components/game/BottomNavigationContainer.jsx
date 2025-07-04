// src/components/game/BottomNavigationContainer.jsx
import { useState } from "react";
import "./BottomNavigation.css";
import BottomNavigationTop from "./BottomNavigationTop";
import BottomNavigationArea1 from "./BottomNavigationArea1";
import BottomNavigationArea2 from "./BottomNavigationArea2";
import BottomNavigationArea3 from "./BottomNavigationArea3";
import Modal from "../common/Modal";

function BottomNavigationContainer({
  user,
  token,
  onFightEliteBoss,
  onModalOpen,
  onUserUpdate,
}) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showLootLevelModal, setShowLootLevelModal] = useState(false);

  const handleBreakthrough = async () => {
    if (user.currentXp < user.xpToNextLevel) {
      alert("经验不足，无法渡劫！");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/game/attempt-breakthrough",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        onUserUpdate();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Breakthrough failed:", error);
      alert("渡劫失败，请重试");
    }
  };

  const handleUpgradeLootLevel = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/upgrade-loot-level",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        onUserUpdate();
        setShowLootLevelModal(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("升级失败，请重试");
    }
  };

  const handleMainFightClick = () => {
    if (window.fightNearestEnemy) {
      window.fightNearestEnemy();
    }
  };

  // Calculate drop rates for loot level modal
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

  const renderLootLevelModal = () => (
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
          onClick={handleUpgradeLootLevel}
          disabled={user.silverCoins < upgradeCost}
        >
          升级 ({upgradeCost} 银币)
        </button>
        <button
          className="cancel-btn"
          onClick={() => setShowLootLevelModal(false)}
        >
          取消
        </button>
      </div>
    </div>
  );

  const renderEquipmentModal = () => (
    <div className="equipment-details">
      <div className="equipment-stats">
        <div>类型: {selectedEquipment.type}</div>
        <div>
          品质:{" "}
          <span style={{ color: selectedEquipment.color }}>
            {selectedEquipment.tier}
          </span>
        </div>
        <div>等级: {selectedEquipment.level}</div>
        <div>攻击: +{selectedEquipment.attackBonus}</div>
        <div>防御: +{selectedEquipment.defenseBonus}</div>
        <div>生命: +{selectedEquipment.healthBonus}</div>
        <div>速度: +{selectedEquipment.speedBonus}</div>
        <div>战力: +{selectedEquipment.powerRatingBonus}</div>
      </div>
    </div>
  );

  return (
    <div className="bottom-navigation">
      {/* Top Area - User Stats */}
      <BottomNavigationTop user={user} onBreakthrough={handleBreakthrough} />

      {/* Bottom Areas */}
      <div className="bottom-nav-bottom">
        {/* Area 1: Function Grid */}
        <BottomNavigationArea1 onModalOpen={onModalOpen} />

        {/* Area 2: Main Action Area */}
        <BottomNavigationArea2
          user={user}
          onFightEliteBoss={onFightEliteBoss}
          onMainFightClick={handleMainFightClick}
          onShowLootLevelModal={() => setShowLootLevelModal(true)}
        />

        {/* Area 3: Equipment Grid */}
        <BottomNavigationArea3
          user={user}
          onEquipmentClick={setSelectedEquipment}
        />
      </div>

      {/* Equipment Detail Modal - Canvas Modal */}
      <Modal
        isOpen={!!selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        title={selectedEquipment?.name}
        size="small"
        isCanvasModal={true}
      >
        {selectedEquipment && renderEquipmentModal()}
      </Modal>

      {/* Loot Level Modal - Canvas Modal */}
      <Modal
        isOpen={showLootLevelModal}
        onClose={() => setShowLootLevelModal(false)}
        title="掉落等级升级"
        size="large"
        isCanvasModal={true}
      >
        {renderLootLevelModal()}
      </Modal>
    </div>
  );
}

export default BottomNavigationContainer;
