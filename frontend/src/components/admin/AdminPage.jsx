// src/components/AdminPage.jsx
import { useState, useEffect } from "react";
import styles from "./AdminPage.module.css";

function AdminPage({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [gameStats, setGameStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "stats") {
      fetchGameStats();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError("获取用户列表失败");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGameStats(data.stats || {});
      } else {
        setError("获取游戏统计失败");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchUsers(); // Refresh the list
        alert(`用户${action}成功`);
      } else {
        alert(`用户${action}失败`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      alert("操作失败，请重试");
    }
  };

  const tabs = [
    { key: "users", label: "用户管理", icon: "👥" },
    { key: "stats", label: "游戏统计", icon: "📊" },
    { key: "settings", label: "系统设置", icon: "⚙️" },
  ];

  const renderUsers = () => (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>用户管理</h2>
        <button className={styles.refreshButton} onClick={fetchUsers}>
          <span className={styles.refreshIcon}>🔄</span>
          刷新
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      ) : (
        <div className={styles.usersGrid}>
          {users.map((userData) => (
            <div key={userData.id} className={styles.userCard}>
              <div className={styles.userHeader}>
                <div className={styles.userAvatar}>
                  {userData.gender === "male" ? "♂" : "♀"}
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{userData.displayName}</h3>
                  <p className={styles.userEmail}>{userData.email}</p>
                </div>
              </div>

              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>等级:</span>
                  <span className={styles.statValue}>{userData.level}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>包子:</span>
                  <span className={styles.statValue}>{userData.buns}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>状态:</span>
                  <span
                    className={`${styles.statValue} ${
                      userData.isActive ? styles.active : styles.inactive
                    }`}
                  >
                    {userData.isActive ? "活跃" : "禁用"}
                  </span>
                </div>
              </div>

              <div className={styles.userActions}>
                <button
                  className={`${styles.actionButton} ${styles.banButton}`}
                  onClick={() =>
                    handleUserAction(
                      userData.id,
                      userData.isActive ? "ban" : "unban"
                    )
                  }
                >
                  {userData.isActive ? "禁用" : "解禁"}
                </button>
                <button
                  className={`${styles.actionButton} ${styles.resetButton}`}
                  onClick={() => handleUserAction(userData.id, "reset")}
                >
                  重置
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>游戏统计</h2>
        <button className={styles.refreshButton} onClick={fetchGameStats}>
          <span className={styles.refreshIcon}>🔄</span>
          刷新
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      ) : (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>👥</span>
              <h3 className={styles.statCardTitle}>总用户数</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.totalUsers || 0}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>🎮</span>
              <h3 className={styles.statCardTitle}>活跃用户</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.activeUsers || 0}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>⚔️</span>
              <h3 className={styles.statCardTitle}>总战斗次数</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.totalFights || 0}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>🏆</span>
              <h3 className={styles.statCardTitle}>最高等级</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.maxLevel || 0}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>💎</span>
              <h3 className={styles.statCardTitle}>装备总数</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.totalEquipment || 0}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardIcon}>🕒</span>
              <h3 className={styles.statCardTitle}>今日新增</h3>
            </div>
            <div className={styles.statCardValue}>
              {gameStats.todayNewUsers || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>系统设置</h2>
      </div>

      <div className={styles.settingsContainer}>
        <div className={styles.settingGroup}>
          <h3 className={styles.settingGroupTitle}>游戏配置</h3>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>基础经验倍率</label>
            <input
              type="number"
              className={styles.settingInput}
              defaultValue="1.0"
              step="0.1"
            />
          </div>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>掉落率倍率</label>
            <input
              type="number"
              className={styles.settingInput}
              defaultValue="1.0"
              step="0.1"
            />
          </div>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>维护模式</label>
            <select className={styles.settingSelect}>
              <option value="false">关闭</option>
              <option value="true">开启</option>
            </select>
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3 className={styles.settingGroupTitle}>安全设置</h3>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>最大登录尝试次数</label>
            <input
              type="number"
              className={styles.settingInput}
              defaultValue="5"
            />
          </div>
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>会话超时时间(小时)</label>
            <input
              type="number"
              className={styles.settingInput}
              defaultValue="24"
            />
          </div>
        </div>

        <div className={styles.settingActions}>
          <button className={styles.saveButton}>保存设置</button>
          <button className={styles.resetSettingsButton}>重置为默认</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return renderUsers();
      case "stats":
        return renderStats();
      case "settings":
        return renderSettings();
      default:
        return renderUsers();
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.adminTitle}>管理面板</h1>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>管理员: {user.displayName}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.logoutButton} onClick={onLogout}>
            <span className={styles.logoutIcon}>🚪</span>
            退出登录
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.adminNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.navTab} ${
              activeTab === tab.key ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.adminMain}>
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPage;
