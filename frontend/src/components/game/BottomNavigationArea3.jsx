// src/components/game/BottomNavigationArea3.jsx

function BottomNavigationArea3({ user, onEquipmentClick }) {
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

  const getEquippedItem = (slotKey) => {
    return user.equippedItems?.[slotKey];
  };

  const getTierColor = (tier) => {
    const colors = {
      凡品: "#808080",
      良品: "#008000",
      上品: "#008B8B",
      极品: "#DDA0DD",
      灵品: "#FFFF00",
      王品: "#FFA500",
      圣品: "#FF0000",
      帝品: "#FFC0CB",
      "帝品.精": "#800080",
      "帝品.珍": "#006400",
      "帝品.极": "#00008B",
      "帝品.绝": "#4B0082",
      "仙品.精": "#B8860B",
      "仙品.极": "#8B0000",
    };
    return colors[tier] || "#808080";
  };

  return (
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
              onClick={() => equippedItem && onEquipmentClick(equippedItem)}
              title={slot.name}
            >
              {equippedItem ? (
                <div
                  className="equipped-item"
                  style={{
                    backgroundColor: getTierColor(equippedItem.tier),
                    borderColor: getTierColor(equippedItem.tier),
                  }}
                >
                  <div className="item-icon">{slot.icon}</div>
                  {/* <div className="item-tier">{equippedItem.tier}</div> */}
                </div>
              ) : (
                <div className="empty-slot">
                  <div className="slot-icon">{slot.icon}</div>
                  {/* <div className="slot-name">{slot.name}</div> */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavigationArea3;
