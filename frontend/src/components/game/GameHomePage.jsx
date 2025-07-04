// src/components/game/GameHomePage.jsx
import { useState, useEffect } from "react";
import "./GameHomePage.css";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";
import RightNavigation from "./RightNavigation";
import BottomNavigation from "./BottomNavigation";
import GameCanvas from "./GameCanvas";

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

      {/* Loot Modal */}
      {showModal === "loot" && selectedItems.length > 0 && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="loot-modal" onClick={(e) => e.stopPropagation()}>
            <h3>战利品</h3>
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
                    <button
                      className="sell-btn"
                      onClick={() => handleSellItem(item)}
                    >
                      出售 ({item.sellValue}银币)
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-modal-btn" onClick={closeModal}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Other Modals can be added here based on showModal state */}
    </div>
  );
}

export default GameHomePage;
