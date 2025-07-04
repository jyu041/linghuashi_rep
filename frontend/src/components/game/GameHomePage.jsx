// src/components/game/GameHomePage.jsx
import { useState, useEffect } from "react";
import "./GameHomePage.css";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";
import RightNavigation from "./RightNavigation";
import BottomNavigation from "./BottomNavigation";
import GameCanvas from "./GameCanvas";
import Modal from "../common/Modal";

function GameHomePage({ user, token, onLogout }) {
  const [gameUser, setGameUser] = useState(user);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
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

  const closeModal = () => {
    setShowModal(null);
    setSelectedItems([]);
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

  const renderModalContent = () => {
    switch (showModal) {
      case "loot":
        return renderLootModal();
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
      case "福利":
      case "超值豪礼":
      case "活动":
        return "large";
      default:
        return "medium";
    }
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
      <LeftNavigation user={gameUser} onModalOpen={setShowModal} />

      {/* Right Navigation */}
      <RightNavigation user={gameUser} onModalOpen={setShowModal} />

      {/* Main Game Canvas */}
      <GameCanvas
        user={gameUser}
        onFightEnemy={handleFightEnemy}
        loading={loading}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        user={gameUser}
        token={token}
        onFightEliteBoss={handleFightEliteBoss}
        onModalOpen={setShowModal}
        onUserUpdate={updateUserData}
      />

      {/* Shared Modal Component */}
      <Modal
        isOpen={!!showModal}
        onClose={closeModal}
        title={getModalTitle()}
        size={getModalSize()}
        className={showModal === "loot" ? "loot-modal-custom" : ""}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default GameHomePage;
