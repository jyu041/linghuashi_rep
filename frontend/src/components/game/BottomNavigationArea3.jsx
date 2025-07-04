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
  );
}

export default BottomNavigationArea3;
