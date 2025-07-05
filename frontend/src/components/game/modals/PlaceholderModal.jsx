// src/components/game/modals/PlaceholderModal.jsx
import styles from "./PlaceholderModal.module.css";

function PlaceholderModal({ feature, onClose }) {
  const getFeatureInfo = () => {
    const featureMap = {
      福利: {
        title: "福利中心",
        description: "各种游戏福利和奖励",
        icon: "🎁",
        features: ["每日签到", "在线奖励", "成就奖励", "活动礼包"],
      },
      超值豪礼: {
        title: "超值豪礼",
        description: "限时特惠礼包和充值奖励",
        icon: "💝",
        features: ["充值礼包", "月卡特权", "限时优惠", "VIP福利"],
      },
      活动: {
        title: "活动中心",
        description: "各种游戏活动和赛事",
        icon: "🎯",
        features: ["限时活动", "节日庆典", "竞赛活动", "社区活动"],
      },
      限时礼包: {
        title: "限时礼包",
        description: "限时特价商品和礼包",
        icon: "⏰",
        features: ["新手礼包", "升级礼包", "节日礼包", "特惠商城"],
      },
      新手礼包: {
        title: "新手礼包",
        description: "专为新玩家准备的礼包",
        icon: "🆕",
        features: ["入门装备", "经验加成", "货币奖励", "指导教程"],
      },
      掌天瓶: {
        title: "掌天瓶",
        description: "神秘的炼丹器具",
        icon: "🏺",
        features: ["炼制丹药", "提升属性", "特殊效果", "高级功能"],
      },
      星海壶: {
        title: "星海壶",
        description: "蕴含星辰力量的法器",
        icon: "🫖",
        features: ["星力收集", "属性增强", "特殊技能", "进阶功能"],
      },
      每日任务: {
        title: "每日任务",
        description: "每天可完成的任务挑战",
        icon: "📋",
        features: ["经验任务", "战斗任务", "收集任务", "社交任务"],
      },
      市场: {
        title: "交易市场",
        description: "玩家间的装备交易平台",
        icon: "🏪",
        features: ["装备交易", "材料买卖", "拍卖系统", "价格查询"],
      },
      仙途: {
        title: "仙途历程",
        description: "修仙之路的成就系统",
        icon: "🌟",
        features: ["境界提升", "成就奖励", "修炼进度", "仙途排行"],
      },
    };

    return (
      featureMap[feature] || {
        title: feature || "未知功能",
        description: "该功能正在开发中",
        icon: "⚙️",
        features: ["敬请期待", "即将推出", "开发中", "筹备阶段"],
      }
    );
  };

  const info = getFeatureInfo();

  return (
    <div className={styles.placeholderModal}>
      <div className={styles.modalHeader}>
        <div className={styles.featureIcon}>{info.icon}</div>
        <h3 className={styles.modalTitle}>{info.title}</h3>
      </div>

      <div className={styles.modalContent}>
        <div className={styles.description}>{info.description}</div>

        <div className={styles.featureList}>
          <h4 className={styles.featureListTitle}>功能特色:</h4>
          <ul className={styles.features}>
            {info.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.statusMessage}>
          <div className={styles.statusIcon}>🚧</div>
          <div className={styles.statusText}>
            该功能正在紧张开发中，敬请期待！
          </div>
        </div>

        <div className={styles.comingSoon}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <div className={styles.progressText}>开发进度: 进行中...</div>
        </div>
      </div>

      <div className={styles.modalActions}>
        <button className={styles.closeButton} onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
}

export default PlaceholderModal;
