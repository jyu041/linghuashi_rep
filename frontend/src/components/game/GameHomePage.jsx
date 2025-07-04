// src/components/game/GameHomePage.jsx
import { useState, useEffect } from "react";
import "./GameHomePage.css";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";
import RightNavigation from "./RightNavigation";
import BottomNavigationContainer from "./BottomNavigationContainer";
import GameCanvas from "./GameCanvas";
import Modal from "../common/Modal";

function GameHomePage({ user, token, onLogout }) {
  const [gameUser, setGameUser] = useState(user);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState(null); // For passing data to modals
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGameUser(user);
  }, [user]);

  const updateUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/user-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGameUser(data.user);
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleFightEnemy = async (enemyType, positionX, positionY) => {
    if (gameUser.buns < gameUser.xMultiplier) {
      alert("包子不足！");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/fight-enemy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            enemyType,
            positionX,
            positionY,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setGameUser(data.user);
        setSelectedItems(data.droppedItems);
        setShowModal("loot");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Fight failed:", error);
      alert("战斗失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleFightEliteBoss = async () => {
    if (gameUser.eliteBossCharges < 1) {
      alert("精英怪次数不足！");
      return;
    }

    if (gameUser.buns < 15) {
      alert("包子不足！");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/fight-elite-boss",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setGameUser(data.user);
        setSelectedItems(data.droppedItems);
        setShowModal("loot");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Elite boss fight failed:", error);
      alert("精英怪战斗失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleEquipItem = async (item) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/equip-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: item.id }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setGameUser(data.user);
        setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Equip failed:", error);
      alert("装备失败，请重试");
    }
  };

  const handleSellItem = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/game/sell-item?itemId=${item.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setGameUser(data.user);
        setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Sell failed:", error);
      alert("出售失败，请重试");
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
        updateUserData();
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("升级失败，请重试");
    }
  };

  // Enhanced modal opener that can handle data
  const handleModalOpen = (modalType, data = null) => {
    setShowModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setShowModal(null);
    setModalData(null);
    setSelectedItems([]);
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

  const renderLootModal = () => (
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
              <button
                className="equip-btn"
                onClick={() => handleEquipItem(item)}
              >
                装备
              </button>
              <button className="sell-btn" onClick={() => handleSellItem(item)}>
                出售 ({item.sellValue}银币)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLootLevelUpgradeModal = () => {
    const currentRates = calculateDropRates(gameUser.lootDropLevel);
    const nextRates = calculateDropRates(gameUser.lootDropLevel + 1);
    const upgradeCost = calculateUpgradeCost(gameUser.lootDropLevel);

    return (
      <div className="loot-level-content">
        <div className="current-level-section">
          <h4>当前等级 {gameUser.lootDropLevel} 掉落率:</h4>
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
          <h4>升级到等级 {gameUser.lootDropLevel + 1} 掉落率:</h4>
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
          <p>升级费用: {upgradeCost} 银币</p>
          <p>你的银币: {gameUser.silverCoins}</p>
        </div>

        <div className="modal-buttons">
          <button
            className="upgrade-btn"
            onClick={handleUpgradeLootLevel}
            disabled={gameUser.silverCoins < upgradeCost}
          >
            升级 ({upgradeCost} 银币)
          </button>
          <button className="cancel-btn" onClick={closeModal}>
            取消
          </button>
        </div>
      </div>
    );
  };

  const renderEquipmentDetailsModal = () => {
    if (!modalData) return null;

    return (
      <div className="equipment-details">
        <div className="equipment-stats">
          <div>类型: {modalData.type}</div>
          <div>
            品质:{" "}
            <span style={{ color: modalData.color }}>{modalData.tier}</span>
          </div>
          <div>等级: {modalData.level}</div>
          <div>攻击: +{modalData.attackBonus}</div>
          <div>防御: +{modalData.defenseBonus}</div>
          <div>生命: +{modalData.healthBonus}</div>
          <div>速度: +{modalData.speedBonus}</div>
          <div>战力: +{modalData.powerRatingBonus}</div>
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    switch (showModal) {
      case "loot":
        return renderLootModal();
      case "lootLevelUpgrade":
        return renderLootLevelUpgradeModal();
      case "equipmentDetails":
        return renderEquipmentDetailsModal();
      case "掌天瓶":
        return <div className="placeholder-content">掌天瓶功能开发中...</div>;
      case "星海壶":
        return <div className="placeholder-content">星海壶功能开发中...</div>;
      case "福利":
        return <div className="placeholder-content">福利系统开发中...</div>;
      case "超值豪礼":
        return <div className="placeholder-content">超值豪礼开发中...</div>;
      case "活动":
        return <div className="placeholder-content">活动系统开发中...</div>;
      case "限时礼包":
        return <div className="placeholder-content">限时礼包开发中...</div>;
      case "新手礼包":
        return <div className="placeholder-content">新手礼包开发中...</div>;
      case "每日任务":
        return <div className="placeholder-content">每日任务系统开发中...</div>;
      case "市场":
        return <div className="placeholder-content">市场系统开发中...</div>;
      case "仙途":
        return <div className="placeholder-content">仙途系统开发中...</div>;
      default:
        return <div className="placeholder-content">功能开发中...</div>;
    }
  };

  const getModalTitle = () => {
    switch (showModal) {
      case "loot":
        return "战利品";
      case "lootLevelUpgrade":
        return "掉落等级升级";
      case "equipmentDetails":
        return modalData?.name || "装备详情";
      case "掌天瓶":
        return "掌天瓶";
      case "星海壶":
        return "星海壶";
      case "福利":
        return "福利";
      case "超值豪礼":
        return "超值豪礼";
      case "活动":
        return "活动";
      case "限时礼包":
        return "限时礼包";
      case "新手礼包":
        return "新手礼包";
      case "每日任务":
        return "每日任务";
      case "市场":
        return "市场";
      case "仙途":
        return "仙途";
      default:
        return "功能";
    }
  };

  const getModalSize = () => {
    switch (showModal) {
      case "loot":
        return "extra-large";
      case "lootLevelUpgrade":
        return "large";
      case "equipmentDetails":
        return "small";
      case "福利":
      case "超值豪礼":
      case "活动":
        return "large";
      default:
        return "medium";
    }
  };

  // Determine if modal should be canvas modal (appears over game area)
  const isCanvasModal = () => {
    return ["lootLevelUpgrade", "equipmentDetails"].includes(showModal);
  };

  return (
    <div className="game-home-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>战斗中...</p>
        </div>
      )}

      {/* Top Navigation */}
      <TopNavigation user={gameUser} />

      {/* Left Navigation */}
      <LeftNavigation user={gameUser} onModalOpen={handleModalOpen} />

      {/* Right Navigation */}
      <RightNavigation user={gameUser} onModalOpen={handleModalOpen} />

      {/* Main Game Canvas */}
      <GameCanvas
        user={gameUser}
        onFightEnemy={handleFightEnemy}
        loading={loading}
      />

      {/* Bottom Navigation Container */}
      <BottomNavigationContainer
        user={gameUser}
        token={token}
        onFightEliteBoss={handleFightEliteBoss}
        onModalOpen={handleModalOpen}
        onUserUpdate={updateUserData}
      />

      {/* Unified Modal System */}
      <Modal
        isOpen={!!showModal}
        onClose={closeModal}
        title={getModalTitle()}
        size={getModalSize()}
        className={showModal === "loot" ? "loot-modal-custom" : ""}
        isCanvasModal={isCanvasModal()}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default GameHomePage;
