// src/components/game/modals/LootLevelModal.jsx
import { useState } from "react";
import styles from "./LootLevelModal.module.css";
import {
  getTierBackgroundStyle,
  getTierDisplayName,
} from "../../../utils/tierColors";

function LootLevelModal({ user, onClose }) {
  const [activeTab, setActiveTab] = useState("掉落等级");

  const tabs = ["掉落等级", "倍数升级"];

  // Mock drop rate data - this would come from backend
  const getDropRates = (level) => {
    const rates = {
      凡品: Math.max(0, 60 - level * 2),
      良品: Math.max(0, 25 - level),
      上品: Math.max(0, 10 - level * 0.5),
      极品: Math.min(20, level * 0.5),
      灵品: Math.min(15, Math.max(0, level - 10) * 0.3),
      王品: Math.min(10, Math.max(0, level - 20) * 0.2),
      圣品: Math.min(8, Math.max(0, level - 30) * 0.15),
      帝品: Math.min(5, Math.max(0, level - 40) * 0.1),
      "帝品•精": Math.min(3, Math.max(0, level - 50) * 0.08),
      "帝品•珍": Math.min(2, Math.max(0, level - 60) * 0.05),
      "帝品•极": Math.min(1.5, Math.max(0, level - 70) * 0.03),
      "帝品•绝": Math.min(1, Math.max(0, level - 80) * 0.02),
      "仙品•精": Math.min(0.5, Math.max(0, level - 90) * 0.01),
      "仙品•极": Math.min(0.3, Math.max(0, level - 100) * 0.005),
    };
    return rates;
  };

  const currentRates = getDropRates(user.lootDropLevel);
  const nextRates = getDropRates(user.lootDropLevel + 1);

  const getNewTiers = () => {
    const current = Object.keys(currentRates).filter(
      (tier) => currentRates[tier] > 0
    );
    const next = Object.keys(nextRates).filter((tier) => nextRates[tier] > 0);
    return next.filter((tier) => !current.includes(tier));
  };

  const newTiers = getNewTiers();

  const canUpgrade = () => {
    // Mock upgrade requirements
    const requiredBuns = (user.lootDropLevel + 1) * 1000;
    const requiredLevel = user.lootDropLevel * 5;
    return user.buns >= requiredBuns && user.level >= requiredLevel;
  };

  const renderDropRateItem = (tier, rate, isNew = false) => (
    <div key={tier} className={styles.rateItem}>
      <div
        className={styles.tierBackground}
        style={getTierBackgroundStyle(tier)}
      >
        <span className={styles.tierName}>{getTierDisplayName(tier)}</span>
        <span className={styles.rateValue}>{rate.toFixed(1)}%</span>
        {isNew && <span className={styles.newTier}>新</span>}
      </div>
    </div>
  );

  return (
    <div className={styles.lootLevelContent}>
      {/* Tab Navigation */}
      <div className={styles.lootTabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "掉落等级" && (
        <>
          {/* Current Level Section */}
          <div className={styles.currentLevelSection}>
            <h4>当前等级：{user.lootDropLevel}级</h4>
            <div className={styles.dropRates}>
              {Object.entries(currentRates).map(([tier, rate]) =>
                rate > 0 ? renderDropRateItem(tier, rate) : null
              )}
            </div>
          </div>

          {/* Next Level Section */}
          <div className={styles.nextLevelSection}>
            <h4>下一等级：{user.lootDropLevel + 1}级</h4>
            <div className={styles.dropRates}>
              {Object.entries(nextRates).map(([tier, rate]) =>
                rate > 0
                  ? renderDropRateItem(tier, rate, newTiers.includes(tier))
                  : null
              )}
            </div>
          </div>

          {/* Upgrade Requirements */}
          <div className={styles.upgradeRequirements}>
            <h4>升级要求</h4>
            <div className={styles.requirementItem}>
              <span>包子消耗:</span>
              <span
                className={
                  user.buns >= (user.lootDropLevel + 1) * 1000
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                {(user.lootDropLevel + 1) * 1000}
              </span>
            </div>
            <div className={styles.requirementItem}>
              <span>等级要求:</span>
              <span
                className={
                  user.level >= user.lootDropLevel * 5
                    ? styles.requirementMet
                    : styles.requirementNotMet
                }
              >
                {user.lootDropLevel * 5}级
              </span>
            </div>
          </div>
        </>
      )}

      {activeTab === "倍数升级" && (
        <>
          {/* Current Multiplier Section */}
          <div className={styles.currentMultiplierSection}>
            <h4>当前倍数：{user.xMultiplier || 1}倍</h4>
            <p>每次战斗获得 {user.xMultiplier || 1} 倍奖励</p>
          </div>

          {/* Next Multiplier Section */}
          <div className={styles.nextMultiplierSection}>
            <h4>下一等级：{(user.xMultiplier || 1) + 1}倍</h4>
            <p>每次战斗获得 {(user.xMultiplier || 1) + 1} 倍奖励</p>
          </div>

          {/* Upgrade Cost */}
          <div className={styles.upgradeRequirements}>
            <h4>升级消耗</h4>
            <div className={styles.requirementItem}>
              <span>包子消耗:</span>
              <span className={styles.requirementNotMet}>
                {((user.xMultiplier || 1) + 1) * 5000}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Modal Buttons */}
      <div className={styles.modalButtons}>
        <button className={styles.upgradeBtn} disabled={!canUpgrade()}>
          升级
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}

export default LootLevelModal;
