// src/components/game/GameHomePage.jsx
import { useState, useEffect } from "react";
import "./GameHomePage.css";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";
import RightNavigation from "./RightNavigation";
import BottomNavigationContainer from "./BottomNavigationContainer";
import GameCanvas from "./GameCanvas";
import Modal from "../common/Modal";

// Import the separated modal components
import LootModal from "./modals/LootModal.jsx";
import LootLevelModal from "./modals/LootLevelModal";
import EquipmentDetailsModal from "./modals/EquipmentDetailsModal";
import PlaceholderModal from "./modals/PlaceholderModal";

function GameHomePage({ user, token, onLogout }) {
  const [gameUser, setGameUser] = useState(user);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState(null);
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

  const handleModalOpen = (modalType, data = null) => {
    setShowModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setShowModal(null);
    setModalData(null);
    setSelectedItems([]);
  };

  const renderModalContent = () => {
    switch (showModal) {
      case "loot":
        return (
          <LootModal
            selectedItems={selectedItems}
            onEquipItem={handleEquipItem}
            onSellItem={handleSellItem}
          />
        );
      case "lootLevelUpgrade":
        return (
          <LootLevelModal
            user={gameUser}
            onUpgrade={handleUpgradeLootLevel}
            onClose={closeModal}
          />
        );
      case "equipmentDetails":
        return <EquipmentDetailsModal equipment={modalData} />;
      case "掌天瓶":
      case "星海壶":
      case "福利":
      case "超值豪礼":
      case "活动":
      case "限时礼包":
      case "新手礼包":
      case "每日任务":
      case "市场":
      case "仙途":
        return <PlaceholderModal feature={showModal} />;
      default:
        return <PlaceholderModal feature="未知功能" />;
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
      default:
        return showModal || "功能";
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
