// src/components/game/TopNavigation.jsx
import "./TopNavigation.css";
import { formatChineseNumber } from "../../utils/formatNumber";

function TopNavigation({ user }) {
  const getProfileImage = () => {
    // Default avatar based on gender and profession
    const genderSymbol = user.gender === "male" ? "♂" : "♀";
    return genderSymbol;
  };

  const getP2WIcons = () => {
    const icons = [];

    // Show P2W items if user owns them
    if (user.level >= 60 && user.ownedP2WItems?.["掌天瓶"]) {
      icons.push(
        <div key="瓶" className="p2w-icon" title="掌天瓶">
          🏺
        </div>
      );
    }

    if (user.level >= 120 && user.ownedP2WItems?.["星海壶"]) {
      icons.push(
        <div key="壶" className="p2w-icon" title="星海壶">
          🫖
        </div>
      );
    }

    // Add third icon if there are more P2W items
    if (user.ownedP2WItems?.["speed_boost"]) {
      icons.push(
        <div key="speed" className="p2w-icon" title="速度提升">
          ⚡
        </div>
      );
    }

    return icons;
  };

  return (
    <div className="top-navigation">
      {/* Profile Picture - Left 1/5 */}
      <div className="profile-section">
        <div className="profile-avatar">{getProfileImage()}</div>
      </div>

      {/* Main Info - Right 4/5 */}
      <div className="main-info-section">
        {/* Row 1: Display Name, Power Rating, P2W Icons */}
        <div className="info-row-1">
          <div className="display-name">{user.displayName}</div>
          <div className="power-rating">
            <span className="power-label">战力</span>
            <span className="power-value">
              {formatChineseNumber(user.powerRating)}
            </span>
          </div>
          <div className="p2w-icons">{getP2WIcons()}</div>
        </div>

        {/* Row 2: Currencies */}
        <div className="info-row-2">
          <div className="currency-item">
            <span className="currency-icon">🪙</span>
            <span className="currency-amount">
              {formatChineseNumber(user.silverCoins)}
            </span>
            <button className="currency-plus">+</button>
          </div>
          <div className="currency-item">
            <span className="currency-icon">💰</span>
            <span className="currency-amount">
              {formatChineseNumber(user.goldCoins)}
            </span>
            <button className="currency-plus">+</button>
          </div>
          <div className="currency-item">
            <span className="currency-icon">💎</span>
            <span className="currency-amount">
              {formatChineseNumber(user.godCoins)}
            </span>
            <button className="currency-plus">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;
