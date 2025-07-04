// src/components/game/LeftNavigation.jsx
import "./LeftNavigation.css";

function LeftNavigation({ user, onModalOpen }) {
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
    lootIcon: "⚔️",
    lootAmount: 5,
    objective: "击败哥布林",
    current: 194,
    total: 200,
  };

  return (
    <div className="left-navigation">
      {/* P2W and Welfare Buttons */}
      <div className="left-menu-items">
        {leftMenuItems.map((item) => {
          if (!item.show) return null;

          return (
            <button
              key={item.key}
              className="left-menu-btn"
              onClick={() => onModalOpen(item.key)}
              title={item.description}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Current Main Mission */}
      <div className="main-mission-container">
        <div className="mission-loot">
          <span className="loot-icon">{currentMission.lootIcon}</span>
          <span className="loot-amount">×{currentMission.lootAmount}</span>
        </div>
        <div className="mission-details">
          <div className="mission-objective">{currentMission.objective}</div>
          <div className="mission-progress">
            {currentMission.current}/{currentMission.total}
          </div>
          <div className="mission-progress-bar">
            <div
              className="mission-progress-fill"
              style={{
                width: `${
                  (currentMission.current / currentMission.total) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftNavigation;
