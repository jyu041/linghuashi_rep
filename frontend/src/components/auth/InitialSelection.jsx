// src/components/auth/InitialSelection.jsx
import { useState } from "react";
import "./InitialSelection.css";

function InitialSelection({ token, onComplete }) {
  const [displayName, setDisplayName] = useState("");
  const [profession, setProfession] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const professions = [
    { id: "warrior", name: "战士", description: "近战物理攻击专家" },
    { id: "mage", name: "法师", description: "远程法术攻击专家" },
    { id: "assassin", name: "刺客", description: "高速度高暴击专家" },
    { id: "healer", name: "治疗师", description: "支援和恢复专家" },
  ];

  const genders = [
    { id: "male", name: "男", icon: "♂" },
    { id: "female", name: "女", icon: "♀" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName || !profession || !gender) {
      setError("请完成所有选择");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/initial-selection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName,
            profession,
            gender,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onComplete(data.user);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="initial-selection-container">
      <div className="selection-backdrop">
        <div className="mystical-bg"></div>
      </div>

      <div className="selection-content">
        <h1 className="selection-title">开始你的修仙之路</h1>
        <p className="selection-subtitle">选择你的身份和道路</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="selection-form">
          {/* Display Name */}
          <div className="form-section">
            <h3>道号</h3>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="请输入你的道号"
              maxLength="20"
              className="name-input"
            />
          </div>

          {/* Gender Selection */}
          <div className="form-section">
            <h3>性别</h3>
            <div className="gender-options">
              {genders.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`gender-option ${
                    gender === g.id ? "selected" : ""
                  }`}
                  onClick={() => setGender(g.id)}
                >
                  <span className="gender-icon">{g.icon}</span>
                  <span className="gender-name">{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profession Selection */}
          <div className="form-section">
            <h3>职业</h3>
            <div className="profession-grid">
              {professions.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  className={`profession-card ${
                    profession === prof.id ? "selected" : ""
                  }`}
                  onClick={() => setProfession(prof.id)}
                >
                  <div className="profession-name">{prof.name}</div>
                  <div className="profession-desc">{prof.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="confirm-btn"
            disabled={loading || !displayName || !profession || !gender}
          >
            {loading ? "创建中..." : "确认选择"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InitialSelection;
