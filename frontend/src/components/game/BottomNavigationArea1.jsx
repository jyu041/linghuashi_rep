// src/components/game/BottomNavigationArea1.jsx
import styles from "./BottomNavigationArea1.module.css";

function BottomNavigationArea1({ onModalOpen }) {
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

  return (
    <div className={`${styles.navArea} ${styles.area1}`}>
      <div className={styles.functionGrid}>
        {area1Buttons.map((btn, index) => (
          <button
            key={btn.key}
            className={styles.functionBtn}
            onClick={() => onModalOpen(btn.key)}
            title={btn.name}
          >
            <span className={styles.btnIcon}>{btn.icon}</span>
            <span className={styles.btnText}>{btn.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNavigationArea1;
