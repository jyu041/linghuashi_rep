// src/components/game/BottomNavigation.jsx
import { useState } from "react";
import "./BottomNavigation.css";

function BottomNavigation({
  user,
  token,
  onFightEliteBoss,
  onModalOpen,
  onUserUpdate,
}) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const calculateLevelProgress = () => {
    if (user.currentXp >= user.xpToNextLevel) {
      return 100; // Ready for breakthrough
    }
    return (user.currentXp / user.xpToNextLevel) * 100;
  };

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

  const equipmentSlots = [
    // First row
    { key: "武器", name: "武器", icon: "⚔️" },
    { key: "头部", name: "头部", icon: "👑" },
    { key: "身体", name: "身体", icon: "👔" },
    { key: "脚部", name: "脚部", icon: "👢" },
    { key: "腰部", name: "腰部", icon: "🔗" },
    { key: "护臂", name: "护臂", icon: "🛡️" },
    // Second row
    { key: "戒指", name: "戒指", icon: "💍" },
    { key: "手部", name: "手部", icon: "🧤" },
    { key: "腿部", name: "腿部", icon: "👖" },
    { key: "项链", name: "项链", icon: "📿" },
    { key: "护身符", name: "护身符", icon: "🔮" },
    { key: "暗器", name: "暗器", icon: "🗡️" },
  ];

  const area1Buttons = [
    // First row
    { key: "法相", name: "法相", icon: "👻" },
    { key: "坐骑", name: "坐骑", icon: "🐉" },
    { key: "魂玉", name: "魂玉", icon: "💠" },
    { key: "灵兽", name: "灵兽", icon: "🦅" },
    { key: "法宝", name: "法宝", icon: "📜" },
    { key: "鱼获", name: "鱼获", icon: "🐟" },
    // Second row
    { key: "神兵", name: "神兵", icon: "⚡" },
    { key: "武魂", name: "武魂", icon: "👤" },
    { key: "血缘", name: "血缘", icon: "🩸" },
    { key: "秘宝", name: "秘宝", icon: "💎" },
    { key: "妖灵", name: "妖灵", icon: "👹" },
    { key: "红颜", name: "红颜", icon: "🌹" },
  ];

  const getEquippedItem = (slotKey) => {
    return user.equippedItems?.[slotKey];
  };

  return (
    <div className="bottom-navigation">
      {/* Top Area - User Stats */}
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
            onClick={handleBreakthrough}
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

      {/* Bottom Areas */}
      <div className="bottom-nav-bottom">
        {/* Area 1: Function Grid */}
        <div className="nav-area area-1">
          <div className="function-grid">
            {area1Buttons.map((btn, index) => (
              <button
                key={btn.key}
                className="function-btn"
                onClick={() => onModalOpen(btn.key)}
                title={btn.name}
              >
                <span className="btn-icon">{btn.icon}</span>
                <span className="btn-text">{btn.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Area 2: Main Action Area */}
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
                onClick={handleUpgradeLootLevel}
                title="升级掉落等级"
              >
                {user.lootDropLevel}
              </button>

              <div className="main-fight-btn">
                <div className="multiplier-display">{user.xMultiplier}倍</div>
                <div className="fight-icon">⚔️</div>
                <div className="buns-display">
                  <span className="buns-icon">🥟</span>
                  <span className="buns-count">{user.buns}</span>
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

        {/* Area 3: Equipment Grid */}
        <div className="nav-area area-3">
          <div className="equipment-grid">
            {equipmentSlots.map((slot) => {
              const equippedItem = getEquippedItem(slot.key);
              return (
                <div
                  key={slot.key}
                  className={`equipment-slot ${
                    equippedItem ? "equipped" : "empty"
                  }`}
                  onClick={() =>
                    equippedItem && setSelectedEquipment(equippedItem)
                  }
                  title={slot.name}
                >
                  {equippedItem ? (
                    <div
                      className="equipped-item"
                      style={{ borderColor: equippedItem.color }}
                    >
                      <div className="item-icon">{slot.icon}</div>
                      <div
                        className="item-tier"
                        style={{ color: equippedItem.color }}
                      >
                        {equippedItem.tier}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-slot">
                      <div className="slot-icon">{slot.icon}</div>
                      <div className="slot-name">{slot.name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEquipment(null)}
        >
          <div className="equipment-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: selectedEquipment.color }}>
              {selectedEquipment.name}
            </h3>
            <div className="equipment-stats">
              <div>类型: {selectedEquipment.type}</div>
              <div>
                品质:{" "}
                <span style={{ color: selectedEquipment.color }}>
                  {selectedEquipment.tier}
                </span>
              </div>
              <div>等级: {selectedEquipment.level}</div>
              <div>攻击: +{selectedEquipment.attackBonus}</div>
              <div>防御: +{selectedEquipment.defenseBonus}</div>
              <div>生命: +{selectedEquipment.healthBonus}</div>
              <div>速度: +{selectedEquipment.speedBonus}</div>
              <div>战力: +{selectedEquipment.powerRatingBonus}</div>
            </div>
            <button onClick={() => setSelectedEquipment(null)}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BottomNavigation;
