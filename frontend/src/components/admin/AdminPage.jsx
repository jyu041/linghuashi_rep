// src/components/admin/AdminPage.jsx
import { useState, useEffect } from "react";
import "./AdminPage.css";

function AdminPage({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [targetUserId, setTargetUserId] = useState("");
  const [currencyType, setCurrencyType] = useState("silver");
  const [amount, setAmount] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        alert("Failed to fetch admin stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      alert("Error fetching admin stats");
    } finally {
      setLoading(false);
    }
  };

  const handleGiveCurrency = async (e) => {
    e.preventDefault();
    if (!targetUserId || !amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/give-currency?targetUserId=${targetUserId}&currencyType=${currencyType}&amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Currency given successfully!");
        setTargetUserId("");
        setAmount("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error giving currency:", error);
      alert("Error giving currency");
    }
  };

  const handleSetLevel = async (e) => {
    e.preventDefault();
    if (!targetUserId || !level) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/set-level?targetUserId=${targetUserId}&level=${level}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("User level set successfully!");
        setTargetUserId("");
        setLevel("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error setting level:", error);
      alert("Error setting user level");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num?.toString() || "0";
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          📊 Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === "currency" ? "active" : ""}`}
          onClick={() => setActiveTab("currency")}
        >
          💰 Give Currency
        </button>
        <button
          className={`tab-btn ${activeTab === "level" ? "active" : ""}`}
          onClick={() => setActiveTab("level")}
        >
          ⬆️ Set Level
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "stats" && (
          <div className="stats-panel">
            <h2>Game Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">
                    {formatNumber(stats?.totalUsers)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🟢</div>
                <div className="stat-info">
                  <div className="stat-label">Active Users</div>
                  <div className="stat-value">
                    {formatNumber(stats?.activeUsers)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <div className="stat-label">Average Level</div>
                  <div className="stat-value">
                    {stats?.averageLevel?.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🪙</div>
                <div className="stat-info">
                  <div className="stat-label">Total Silver</div>
                  <div className="stat-value">
                    {formatNumber(stats?.totalSilverCoins)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-label">Total Gold</div>
                  <div className="stat-value">
                    {formatNumber(stats?.totalGoldCoins)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💎</div>
                <div className="stat-info">
                  <div className="stat-label">Total God Coins</div>
                  <div className="stat-value">
                    {formatNumber(stats?.totalGodCoins)}
                  </div>
                </div>
              </div>
            </div>

            <button className="refresh-btn" onClick={fetchAdminStats}>
              🔄 Refresh Stats
            </button>
          </div>
        )}

        {activeTab === "currency" && (
          <div className="currency-panel">
            <h2>Give Currency to User</h2>
            <form onSubmit={handleGiveCurrency} className="admin-form">
              <div className="form-group">
                <label>User ID:</label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency Type:</label>
                <select
                  value={currencyType}
                  onChange={(e) => setCurrencyType(e.target.value)}
                >
                  <option value="silver">Silver (银币)</option>
                  <option value="gold">Gold (元宝)</option>
                  <option value="god">God Coins (天衍令)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                💰 Give Currency
              </button>
            </form>
          </div>
        )}

        {activeTab === "level" && (
          <div className="level-panel">
            <h2>Set User Level</h2>
            <form onSubmit={handleSetLevel} className="admin-form">
              <div className="form-group">
                <label>User ID:</label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Level (1-360):</label>
                <input
                  type="number"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Enter level"
                  min="1"
                  max="360"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                ⬆️ Set Level
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
