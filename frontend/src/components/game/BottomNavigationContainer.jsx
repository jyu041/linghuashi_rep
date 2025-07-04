// src/components/game/BottomNavigationContainer.jsx
import { useState } from "react";
import "./BottomNavigation.css";
import BottomNavigationTop from "./BottomNavigationTop";
import BottomNavigationArea1 from "./BottomNavigationArea1";
import BottomNavigationArea2 from "./BottomNavigationArea2";
import BottomNavigationArea3 from "./BottomNavigationArea3";

function BottomNavigationContainer({
  user,
  token,
  onFightEliteBoss,
  onModalOpen,
  onUserUpdate,
}) {
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

  // Handler for loot level modal - pass to parent
  const handleShowLootLevelModal = () => {
    onModalOpen("lootLevelUpgrade");
  };

  // Handler for equipment click - pass to parent
  const handleEquipmentClick = (equipment) => {
    onModalOpen("equipmentDetails", equipment);
  };

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
          onShowLootLevelModal={handleShowLootLevelModal}
        />

        {/* Area 3: Equipment Grid */}
        <BottomNavigationArea3
          user={user}
          onEquipmentClick={handleEquipmentClick}
        />
      </div>
    </div>
  );
}

export default BottomNavigationContainer;
