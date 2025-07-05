// src/components/game/TopNavigation.jsx
import styles from "./TopNavigation.module.css";
import { formatChineseNumber } from "../../utils/formatNumber";

function TopNavigation({ user, onModalOpen }) {
  const currencies = [
    { key: "buns", icon: "🥟", value: user.buns || 0 },
    { key: "gems", icon: "💎", value: user.gems || 0 },
    { key: "coins", icon: "🪙", value: user.coins || 0 },
  ];

  const p2wIcons = [
    { key: "vip", icon: "👑", action: () => onModalOpen?.("VIP") },
    { key: "shop", icon: "🏪", action: () => onModalOpen?.("商城") },
    { key: "recharge", icon: "💳", action: () => onModalOpen?.("充值") },
  ];

  return (
    <div className={styles.topNavigation}>
      <div className={styles.profileSection}>
        <div className={styles.profileAvatar}>
          {user.gender === "male" ? "♂" : "♀"}
        </div>
      </div>

      <div className={styles.mainInfoSection}>
        <div className={styles.infoRow1}>
          <div className={styles.displayName}>{user.displayName}</div>
          <div className={styles.powerRating}>
            <span className={styles.powerLabel}>战力:</span>
            <span className={styles.powerValue}>
              {formatChineseNumber(user.powerRating || 0)}
            </span>
          </div>
          <div className={styles.p2wIcons}>
            {p2wIcons.map((item) => (
              <button
                key={item.key}
                className={styles.p2wIcon}
                onClick={item.action}
                title={item.key}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.infoRow2}>
          {currencies.map((currency) => (
            <div key={currency.key} className={styles.currencyItem}>
              <span className={styles.currencyIcon}>{currency.icon}</span>
              <span className={styles.currencyValue}>
                {formatChineseNumber(currency.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;
