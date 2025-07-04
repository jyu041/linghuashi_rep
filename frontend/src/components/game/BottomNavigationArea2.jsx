// src/components/game/BottomNavigationArea2.jsx
import { formatChineseNumber } from "../../utils/formatNumber";

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
    <div className="nav-area area-2">
      {/* Top section */}
      <div className="area-2-top">
        <button className="inventory-btn" title="背包">
          🎒
        </button>
        <button className="mail-btn" title="邮件">
          📧
        </button>
        <button
          className="elite-boss-btn"
          onClick={onFightEliteBoss}
          disabled={user.eliteBossCharges < 1 || user.buns < 15}
        >
          精英怪 ({user.eliteBossCharges})
        </button>
      </div>

      {/* Bottom section */}
      <div className="area-2-bottom">
        <div className="side-buttons-left">
          <button className="guild-btn">仙盟</button>
          <button className="cave-btn">洞府</button>
        </div>

        <div className="fight-section">
          <button
            className="loot-level-btn"
            onClick={onShowLootLevelModal}
            title="升级掉落等级"
          >
            {user.lootDropLevel}级
          </button>

          <div className="main-fight-btn" onClick={handleMainFightClick}>
            <div className="multiplier-display">{user.xMultiplier || 1}倍</div>
            <div className="fight-icon">⚔️</div>
            <div className="buns-display">
              <span className="buns-icon">🥟</span>
              <span className="buns-count">
                {formatChineseNumber(user.buns)}
              </span>
            </div>
          </div>

          <button className="auto-fight-btn" title="自动战斗">
            ⚙️
          </button>
        </div>

        <div className="side-buttons-right">
          <button className="challenge-btn">挑战</button>
          <button className="main-quest-btn">主线</button>
        </div>
      </div>
    </div>
  );
}

export default BottomNavigationArea2;
