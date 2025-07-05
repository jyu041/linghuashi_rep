// src/components/game/RightNavigation.jsx
import { useState } from "react";
import styles from "./RightNavigation.module.css";

function RightNavigation({ user, onModalOpen }) {
  const [showActivitiesDropdown, setShowActivitiesDropdown] = useState(false);

  const activities = [
    { key: "每日任务", name: "每日任务", icon: "📋" },
    { key: "市场", name: "市场", icon: "🏪" },
    { key: "仙途", name: "仙途", icon: "🌟" },
    { key: "竞技场", name: "竞技场", icon: "⚔️" },
    { key: "公会战", name: "公会战", icon: "🏰" },
  ];

  const rightMenuItems = [
    {
      key: "活动",
      name: "活动",
      icon: "🎯",
      onClick: () => setShowActivitiesDropdown(!showActivitiesDropdown),
    },
    {
      key: "限时礼包",
      name: "限时礼包",
      icon: "⏰",
      onClick: () => onModalOpen("限时礼包"),
    },
    {
      key: "新手礼包",
      name: "新手礼包",
      icon: "🆕",
      onClick: () => onModalOpen("新手礼包"),
    },
  ];

  return (
    <div className={styles.rightNavigation}>
      <div className={styles.rightMenuItems}>
        {rightMenuItems.map((item) => (
          <div key={item.key} className={styles.rightMenuItem}>
            <button
              className={`${styles.rightMenuBtn} ${
                item.key === "活动" ? styles.activity : ""
              }`}
              onClick={item.onClick}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.name}</span>
            </button>

            {/* Activities Dropdown - opens to the left */}
            {item.key === "活动" && showActivitiesDropdown && (
              <div className={styles.activitiesDropdown}>
                <div className={styles.speechTriangle}></div>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownHeader}>
                    <span>活动列表</span>
                    <button
                      className={styles.closeDropdown}
                      onClick={() => setShowActivitiesDropdown(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className={styles.activitiesList}>
                    {activities.map((activity) => (
                      <button
                        key={activity.key}
                        className={styles.activityItem}
                        onClick={() => {
                          onModalOpen(activity.key);
                          setShowActivitiesDropdown(false);
                        }}
                      >
                        <span className={styles.activityIcon}>
                          {activity.icon}
                        </span>
                        <span className={styles.activityName}>
                          {activity.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightNavigation;
