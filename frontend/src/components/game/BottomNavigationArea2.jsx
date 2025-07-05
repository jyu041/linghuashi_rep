// src/components/game/BottomNavigationArea2.jsx
import { formatChineseNumber } from "../../utils/formatNumber";
import styles from "./BottomNavigationArea2.module.css";

function BottomNavigationArea2({
  user,
  onFightEliteBoss,
  onMainFightClick,
  onShowLootLevelModal,
}) {
  const handleMainFightClick = () => {
    if (user.buns <= 0) {
      alert("包子不足，无法战斗！");
      return;
    }
    onMainFightClick();
  };

  return (
    <div className={`${styles.navArea} ${styles.area2}`}>
      {/* Top section */}
      <div className={styles.area2Top}>
        <button className={styles.inventoryBtn} title="背包">
          🎒
        </button>
        <button className={styles.mailBtn} title="邮件">
          📧
        </button>
        <button
          className={styles.eliteBossBtn}
          onClick={onFightEliteBoss}
          disabled={user.eliteBossCharges < 1 || user.buns < 15}
        >
          精英怪 ({user.eliteBossCharges})
        </button>
      </div>

      {/* Bottom section */}
      <div className={styles.area2Bottom}>
        <div className={styles.sideButtonsLeft}>
          <button className={styles.guildBtn}>仙盟</button>
          <button className={styles.caveBtn}>洞府</button>
        </div>

        <div className={styles.fightSection}>
          <button
            className={styles.lootLevelBtn}
            onClick={onShowLootLevelModal}
            title="升级掉落等级"
          >
            {user.lootDropLevel}级
          </button>

          <div className={styles.mainFightBtn} onClick={handleMainFightClick}>
            <div className={styles.multiplierDisplay}>
              {user.xMultiplier || 1}倍
            </div>
            <div className={styles.fightIcon}>⚔️</div>
            <div className={styles.bunsDisplay}>
              <span className={styles.bunsIcon}>🥟</span>
              <span className={styles.bunsCount}>
                {formatChineseNumber(user.buns)}
              </span>
            </div>
          </div>

          <button className={styles.autoFightBtn} title="自动战斗">
            ⚙️
          </button>
        </div>

        <div className={styles.sideButtonsRight}>
          <button className={styles.challengeBtn}>挑战</button>
          <button className={styles.mainQuestBtn}>主线</button>
        </div>
      </div>
    </div>
  );
}

export default BottomNavigationArea2;
