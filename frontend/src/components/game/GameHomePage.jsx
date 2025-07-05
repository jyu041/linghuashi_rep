// src/components/game/GameHomePage.jsx
import { useState, useEffect, useRef } from "react";
import styles from "./GameHomePage.module.css";
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
import ItemCompareModal from "./modals/ItemCompareModal";
import PlaceholderModal from "./modals/PlaceholderModal";
import UserStatsModal from "./modals/UserStatsModal";

function GameHomePage({ user, token, onLogout }) {
  const [gameUser, setGameUser] = useState(user);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [droppedLoot, setDroppedLoot] = useState([]);
  const fightCooldownRef = useRef(0);

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
        if (data.success) {
          setGameUser(data.user);
        } else if (data.message && data.message.includes("token")) {
          console.log("Token error in updateUserData, calling onTokenError");
          onTokenError && onTokenError();
        }
      } else if (response.status === 401 || response.status === 403) {
        console.log(
          "Authentication error in updateUserData, calling onTokenError"
        );
        onTokenError && onTokenError();
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleFightEnemy = async (enemyType, posX, posY) => {
    // Check if user has enough buns
    if (gameUser.buns <= 0) {
      alert("包子不足，无法战斗！");
      return Promise.reject(new Error("Insufficient buns"));
    }

    // Add cooldown check
    const now = Date.now();
    if (fightCooldownRef.current && now - fightCooldownRef.current < 1000) {
      return Promise.reject(new Error("On cooldown"));
    }

    fightCooldownRef.current = now;
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
            enemyType: enemyType,
            positionX: posX,
            positionY: posY,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update user stats
        setGameUser(data.user);

        // Show loot modal if items dropped
        if (data.droppedItems && data.droppedItems.length > 0) {
          setDroppedLoot(data.droppedItems);
          setModalData({ items: data.droppedItems });
          setShowModal("loot");
        }

        // Show special messages
        if (data.specialMessage) {
          alert(data.specialMessage);
        }

        return data;
      } else {
        // Check if it's a token error
        if (data.message && data.message.includes("token")) {
          console.log("Token error detected, calling onTokenError");
          onTokenError && onTokenError();
          return Promise.reject(
            new Error("Authentication expired. Please login again.")
          );
        }
        throw new Error(data.message || "Fight failed");
      }
    } catch (error) {
      console.error("Fight error:", error);

      // Check if it's a network error with authentication issues
      if (error.message.includes("401") || error.message.includes("403")) {
        console.log("Authentication error detected, calling onTokenError");
        onTokenError && onTokenError();
        alert("认证已过期，请重新登录");
      } else {
        alert(`战斗失败：${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFightEliteBoss = async () => {
    if (gameUser.eliteBossCharges < 1) {
      alert("精英怪挑战次数不足！");
      return;
    }

    if (gameUser.buns < 15) {
      alert("包子不足，无法挑战精英怪！");
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

        // Handle elite boss loot
        if (data.droppedItems && data.droppedItems.length > 0) {
          setDroppedLoot(data.droppedItems);
          setModalData({ items: data.droppedItems });
          setShowModal("loot");
        }

        alert(data.message);
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

  const handleModalOpen = (modalType, data = null) => {
    setModalData(data);
    setShowModal(modalType);
  };

  const closeModal = () => {
    setShowModal(null);
    setModalData(null);
    setDroppedLoot([]);
  };

  const renderModalContent = () => {
    switch (showModal) {
      case "loot":
        return (
          <LootModal
            items={modalData?.items || droppedLoot}
            user={gameUser} // Add user prop here
            onClose={closeModal}
            onEquip={(item) => console.log("Equip item:", item)}
            onCompare={(items) => {
              setSelectedItems(items);
              setShowModal("itemCompare");
            }}
          />
        );
      case "lootLevelUpgrade":
        return <LootLevelModal user={gameUser} onClose={closeModal} />;
      case "equipmentDetails":
        return (
          <EquipmentDetailsModal equipment={modalData} onClose={closeModal} />
        );
      case "itemCompare":
        return <ItemCompareModal items={selectedItems} onClose={closeModal} />;
      case "userStats":
        return <UserStatsModal user={gameUser} onClose={closeModal} />;
      case "福利":
      case "超值豪礼":
      case "活动":
      case "限时礼包":
      case "新手礼包":
      case "掌天瓶":
      case "星海壶":
      case "法相":
      case "坐骑":
      case "魂玉":
      case "灵兽":
      case "法宝":
      case "鱼获":
      case "神兵":
      case "武魂":
      case "血缘":
      case "秘宝":
      case "妖灵":
      case "红颜":
      case "每日任务":
      case "市场":
      case "仙途":
      case "竞技场":
      case "公会战":
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
        return "升级系统";
      case "itemCompare":
        return "装备对比";
      case "equipmentDetails":
        return modalData?.name || "装备详情";
      case "userStats":
        return "角色属性";
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
      case "itemCompare":
        return "large";
      case "equipmentDetails":
        return "small";
      case "userStats":
        return "large";
      case "福利":
      case "超值豪礼":
      case "活动":
        return "large";
      default:
        return "medium";
    }
  };

  const isCanvasModal = () => {
    return [
      "lootLevelUpgrade",
      "equipmentDetails",
      "itemCompare",
      "userStats",
    ].includes(showModal);
  };

  return (
    <div className={styles.gameHomeContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>战斗中...</p>
        </div>
      )}

      {/* Top Navigation */}
      <TopNavigation user={gameUser} onModalOpen={handleModalOpen} />

      {/* Left Navigation */}
      <LeftNavigation
        user={gameUser}
        onModalOpen={handleModalOpen}
        token={token}
        onUserUpdate={updateUserData}
      />

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
