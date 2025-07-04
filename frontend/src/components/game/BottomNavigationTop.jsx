// src/components/game/BottomNavigationTop.jsx

function BottomNavigationTop({ user, onBreakthrough }) {
  const calculateLevelProgress = () => {
    if (user.currentXp >= user.xpToNextLevel) {
      return 100; // Ready for breakthrough
    }
    return (user.currentXp / user.xpToNextLevel) * 100;
  };

  return (
    <div className="bottom-nav-top">
      {/* Row 1: Level, Cultivation, Progress, Breakthrough */}
      <div className="stats-row-1">
        <div className="level-info">等级 {user.level}</div>
        <div className="cultivation-realm">{user.cultivationRealm}</div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${calculateLevelProgress()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {user.currentXp}/{user.xpToNextLevel}
          </span>
        </div>
        <button
          className="breakthrough-btn"
          onClick={onBreakthrough}
          disabled={user.currentXp < user.xpToNextLevel}
        >
          渡劫
        </button>
      </div>

      {/* Row 2: Basic Stats */}
      <div className="stats-row-2">
        <div className="stat-item">
          <span className="stat-label">生命</span>
          <span className="stat-value">{user.health}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">攻击</span>
          <span className="stat-value">{user.attack}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">防御</span>
          <span className="stat-value">{user.defense}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">速度</span>
          <span className="stat-value">{user.speed}</span>
        </div>
        <button className="detailed-stats-btn" title="详细属性">
          🔍
        </button>
      </div>
    </div>
  );
}

export default BottomNavigationTop;
