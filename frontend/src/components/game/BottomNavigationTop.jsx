// src/components/game/BottomNavigationTop.jsx
import styles from "./BottomNavigationTop.module.css";

function BottomNavigationTop({ user, onBreakthrough, onModalOpen }) {
  const getCultivationRealm = () => {
    const level = user.level;
    if (level <= 10) return "凝气前期";
    if (level <= 20) return "凝气中期";
    if (level <= 30) return "凝气后期";
    if (level <= 40) return "凝气圆满";
    if (level <= 80) return "筑基期";
    if (level <= 120) return "结丹期";
    if (level <= 160) return "元婴期";
    if (level <= 200) return "化神期";
    if (level <= 240) return "婴变期";
    if (level <= 280) return "问鼎期";
    if (level <= 320) return "阴虚期";
    if (level <= 360) return "阳实期";
    return "仙人境";
  };

  const isBreakthroughAvailable = () => {
    return user.currentXp >= user.xpToNextLevel;
  };

  const progressPercentage = Math.min(
    (user.currentXp / user.xpToNextLevel) * 100,
    100
  );

  return (
    <div className={styles.bottomNavTop}>
      <div className={styles.topSectionContainer}>
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.levelCultivation}>
            <div className={styles.levelInfo}>等级 {user.level}</div>
            <div className={styles.cultivationRealm}>
              {getCultivationRealm()}
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>
              {user.currentXp}/{user.xpToNextLevel}
            </div>
          </div>

          <button
            className={styles.breakthroughBtn}
            onClick={onBreakthrough}
            disabled={!isBreakthroughAvailable()}
          >
            渡劫
          </button>
        </div>

        {/* Basic Stats Row */}
        <div className={styles.basicStatsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>生命</span>
            <span className={styles.statValue}>
              {user.stats?.生命 || user.health || 100}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>攻击</span>
            <span className={styles.statValue}>
              {user.stats?.攻击 || user.attack || 20}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>防御</span>
            <span className={styles.statValue}>
              {user.stats?.防御 || user.defense || 15}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>速度</span>
            <span className={styles.statValue}>
              {user.stats?.速度 || user.speed || 10}
            </span>
          </div>

          {/* Magnifying Glass Button for Detailed Stats */}
          <button
            className={styles.detailedStatsBtn}
            onClick={() => onModalOpen("userStats")}
            title="查看详细属性"
          >
            🔍
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomNavigationTop;
