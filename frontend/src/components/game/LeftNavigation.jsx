// src/components/game/LeftNavigation.jsx
import { useState } from "react";
import styles from "./LeftNavigation.module.css";

function LeftNavigation({ user, onModalOpen, token, onUserUpdate }) {
  const [missionCompleting, setMissionCompleting] = useState(false);

  const leftMenuItems = [
    {
      key: "掌天瓶",
      name: "掌天瓶",
      icon: "🏺",
      show: user.level >= 60,
      description: "P2W道具",
    },
    {
      key: "星海壶",
      name: "星海壶",
      icon: "🫖",
      show: user.level >= 120,
      description: "P2W道具",
    },
    {
      key: "福利",
      name: "福利",
      icon: "🎁",
      show: true,
      description: "各种福利",
    },
    {
      key: "超值豪礼",
      name: "超值豪礼",
      icon: "💝",
      show: true,
      description: "P2W礼包",
    },
  ];

  // Current main mission (mock data for now)
  const currentMission = {
    lootIcon: "🥟",
    lootAmount: 15, // Reward amount in buns (10-20)
    objective: "击败哥布林",
    current: 194,
    total: 200,
  };

  const isMissionComplete = currentMission.current >= currentMission.total;

  const handleMissionComplete = async () => {
    if (!isMissionComplete || missionCompleting) return;

    setMissionCompleting(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/game/complete-mission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            missionType: "daily",
            rewardAmount: currentMission.lootAmount,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(`任务完成！获得 ${currentMission.lootAmount} 包子奖励！`);
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        alert(data.message || "任务完成失败");
      }
    } catch (error) {
      console.error("Mission completion failed:", error);
      alert("任务完成失败，请重试");
    } finally {
      setMissionCompleting(false);
    }
  };

  return (
    <div className={styles.leftNavigation}>
      {/* P2W and Welfare Buttons */}
      <div className={styles.leftMenuItems}>
        {leftMenuItems.map((item) => {
          if (!item.show) return null;

          return (
            <button
              key={item.key}
              className={styles.leftMenuBtn}
              onClick={() => onModalOpen(item.key)}
              title={item.description}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Current Main Mission */}
      <div
        className={`${styles.mainMissionContainer} ${
          isMissionComplete ? styles.missionComplete : ""
        }`}
        onClick={isMissionComplete ? handleMissionComplete : undefined}
        style={{
          cursor: isMissionComplete ? "pointer" : "default",
        }}
      >
        <div className={styles.missionLoot}>
          <span className={styles.lootIcon}>{currentMission.lootIcon}</span>
          <span className={styles.lootAmount}>
            ×{currentMission.lootAmount}
          </span>
        </div>
        <div className={styles.missionDetails}>
          <div className={styles.missionObjective}>
            {currentMission.objective}
          </div>
          <div className={styles.missionProgress}>
            {currentMission.current}/{currentMission.total}
            {isMissionComplete && !missionCompleting && (
              <span className={styles.completeIndicator}>点击领取</span>
            )}
            {missionCompleting && (
              <span className={styles.completingIndicator}>领取中...</span>
            )}
          </div>
          <div className={styles.missionProgressBar}>
            <div
              className={styles.missionProgressFill}
              style={{
                width: `${Math.min(
                  (currentMission.current / currentMission.total) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftNavigation;
