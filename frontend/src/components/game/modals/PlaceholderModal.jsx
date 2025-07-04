// src/components/game/modals/PlaceholderModal.jsx
import "./PlaceholderModal.css";

function PlaceholderModal({ feature }) {
  const getFeatureInfo = (featureName) => {
    const features = {
      掌天瓶: {
        icon: "🏺",
        description: "强大的P2W道具，可提升修炼速度",
        comingSoon: "即将推出自动战斗和经验加成功能",
      },
      星海壶: {
        icon: "🫖",
        description: "传说级P2W道具，解锁高级功能",
        comingSoon: "即将推出资源自动收集和稀有材料获取",
      },
      福利: {
        icon: "🎁",
        description: "每日签到、活动奖励等福利系统",
        comingSoon: "即将推出每日签到、月卡、成长基金等功能",
      },
      超值豪礼: {
        icon: "💝",
        description: "限时礼包、战令、豪华奖励",
        comingSoon: "即将推出战令系统、限时礼包和VIP特权",
      },
      活动: {
        icon: "🎯",
        description: "各种游戏活动和竞赛",
        comingSoon: "即将推出竞技场、公会战、限时活动",
      },
      限时礼包: {
        icon: "⏰",
        description: "限时特价礼包和促销活动",
        comingSoon: "即将推出节日礼包、新手礼包、进阶礼包",
      },
      新手礼包: {
        icon: "🆕",
        description: "新玩家专属福利礼包",
        comingSoon: "即将推出新手引导、成长礼包、首充奖励",
      },
      每日任务: {
        icon: "📋",
        description: "每日任务和成就系统",
        comingSoon: "即将推出每日任务、周常任务、成就系统",
      },
      市场: {
        icon: "🏪",
        description: "装备交易、材料买卖市场",
        comingSoon: "即将推出装备交易、材料商店、拍卖行",
      },
      仙途: {
        icon: "🌟",
        description: "成就系统和修炼进度奖励",
        comingSoon: "即将推出修炼成就、境界奖励、称号系统",
      },
    };

    return (
      features[featureName] || {
        icon: "🔧",
        description: "新功能正在开发中",
        comingSoon: "敬请期待更多精彩内容",
      }
    );
  };

  const info = getFeatureInfo(feature);

  return (
    <div className="placeholder-content">
      <div className="feature-icon">{info.icon}</div>
      <h3 className="feature-title">{feature}</h3>
      <p className="feature-description">{info.description}</p>
      <div className="coming-soon">
        <div className="coming-soon-badge">敬请期待</div>
        <p>{info.comingSoon}</p>
      </div>
      <div className="development-status">
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "35%" }}></div>
          </div>
          <span className="progress-text">开发进度: 35%</span>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderModal;
