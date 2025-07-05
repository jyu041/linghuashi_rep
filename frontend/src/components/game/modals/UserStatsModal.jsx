// src/components/game/modals/UserStatsModal.jsx
import { useState } from "react";
import styles from "./UserStatsModal.module.css";

function UserStatsModal({ user, onClose }) {
  const [activeTab, setActiveTab] = useState("基础属性");

  const tabs = ["基础属性", "战斗属性/抗性", "元素属性/抗性", "特殊属性"];

  const getStatValue = (statName) => {
    return user.stats?.[statName] || 0;
  };

  const basicStats = [
    { name: "生命", value: getStatValue("生命") || user.health || 100 },
    { name: "攻击", value: getStatValue("攻击") || user.attack || 20 },
    { name: "防御", value: getStatValue("防御") || user.defense || 15 },
    { name: "速度", value: getStatValue("速度") || user.speed || 10 },
    { name: "元素攻击", value: getStatValue("元素攻击") },
    { name: "元素防御", value: getStatValue("元素防御") },
  ];

  const combatStats = [
    { name: "吸血", value: getStatValue("吸血") },
    { name: "吸血抗性", value: getStatValue("吸血抗性") },
    { name: "反击", value: getStatValue("反击") },
    { name: "反击抗性", value: getStatValue("反击抗性") },
    { name: "连击", value: getStatValue("连击") },
    { name: "连击抗性", value: getStatValue("连击抗性") },
    { name: "闪避", value: getStatValue("闪避") },
    { name: "闪避抗性", value: getStatValue("闪避抗性") },
    { name: "暴击", value: getStatValue("暴击") },
    { name: "暴击抗性", value: getStatValue("暴击抗性") },
    { name: "击晕", value: getStatValue("击晕") },
    { name: "击晕抗性", value: getStatValue("击晕抗性") },
  ];

  const elementalStats = [
    { name: "流血", value: getStatValue("流血") },
    { name: "流血抗性", value: getStatValue("流血抗性") },
    { name: "缠绕", value: getStatValue("缠绕") },
    { name: "缠绕抗性", value: getStatValue("缠绕抗性") },
    { name: "冰冻", value: getStatValue("冰冻") },
    { name: "冰冻抗性", value: getStatValue("冰冻抗性") },
    { name: "燃烧", value: getStatValue("燃烧") },
    { name: "燃烧抗性", value: getStatValue("燃烧抗性") },
    { name: "坚韧", value: getStatValue("坚韧") },
    { name: "坚韧抗性", value: getStatValue("坚韧抗性") },
  ];

  const specialStats = [
    { name: "强化爆伤", value: getStatValue("强化爆伤") },
    { name: "弱化爆伤", value: getStatValue("弱化爆伤") },
    { name: "强化治疗", value: getStatValue("强化治疗") },
    { name: "弱化治疗", value: getStatValue("弱化治疗") },
    { name: "强化灵兽", value: getStatValue("强化灵兽") },
    { name: "弱化灵兽", value: getStatValue("弱化灵兽") },
    { name: "最终增伤", value: getStatValue("最终增伤") },
    { name: "最终减伤", value: getStatValue("最终减伤") },
    { name: "PVE增伤", value: getStatValue("PVE增伤") },
    { name: "PVE减伤", value: getStatValue("PVE减伤") },
    { name: "PVP增伤", value: getStatValue("PVP增伤") },
    { name: "PVP减伤", value: getStatValue("PVP减伤") },
  ];

  const getCurrentStats = () => {
    switch (activeTab) {
      case "基础属性":
        return basicStats;
      case "战斗属性/抗性":
        return combatStats;
      case "元素属性/抗性":
        return elementalStats;
      case "特殊属性":
        return specialStats;
      default:
        return basicStats;
    }
  };

  return (
    <div className={styles.userStatsModal}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
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

      {/* Stats Content */}
      <div className={styles.statsContent}>
        <h3 className={styles.sectionTitle}>{activeTab}</h3>
        <div className={styles.statsGrid}>
          {getCurrentStats().map((stat) => (
            <div key={stat.name} className={styles.statItem}>
              <span className={styles.statName}>{stat.name}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <div className={styles.modalActions}>
        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}

export default UserStatsModal;
