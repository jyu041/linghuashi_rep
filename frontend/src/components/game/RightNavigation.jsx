// src/components/game/RightNavigation.jsx
import { useState } from "react";
import "./RightNavigation.css";

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
    <div className="right-navigation">
      <div className="right-menu-items">
        {rightMenuItems.map((item) => (
          <div key={item.key} className="right-menu-item">
            <button className="right-menu-btn" onClick={item.onClick}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </button>

            {/* Activities Dropdown */}
            {item.key === "活动" && showActivitiesDropdown && (
              <div className="activities-dropdown">
                <div className="dropdown-header">
                  <span>活动列表</span>
                  <button
                    className="close-dropdown"
                    onClick={() => setShowActivitiesDropdown(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="activities-list">
                  {activities.map((activity) => (
                    <button
                      key={activity.key}
                      className="activity-item"
                      onClick={() => {
                        onModalOpen(activity.key);
                        setShowActivitiesDropdown(false);
                      }}
                    >
                      <span className="activity-icon">{activity.icon}</span>
                      <span className="activity-name">{activity.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Access Buttons */}
      <div className="quick-access">
        <button
          className="quick-btn daily-btn"
          onClick={() => onModalOpen("每日任务")}
          title="每日任务"
        >
          <span className="quick-icon">📋</span>
          <span className="quick-text">日常</span>
        </button>

        <button
          className="quick-btn market-btn"
          onClick={() => onModalOpen("市场")}
          title="市场"
        >
          <span className="quick-icon">🏪</span>
          <span className="quick-text">市场</span>
        </button>
      </div>
    </div>
  );
}

export default RightNavigation;
