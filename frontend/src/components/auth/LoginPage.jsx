// src/components/LoginPage.jsx
import { useState } from "react";
import styles from "./LoginPage.module.css";

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("请输入邮箱地址");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return false;
    }

    if (!formData.password) {
      setError("请输入密码");
      return false;
    }

    if (formData.password.length < 6) {
      setError("密码长度至少为6位");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || `${isLogin ? "登录" : "注册"}失败，请重试`);
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Register"} error:`, error);
      setError("网络错误，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.gameTitle}>修仙传说</h1>
          <p className={styles.gameSubtitle}>踏上你的修仙之路</p>
        </div>

        <div className={styles.formToggle}>
          <button
            type="button"
            className={`${styles.toggleButton} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              !isLogin ? styles.active : ""
            }`}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              邮箱地址
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="请输入邮箱地址"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              密码
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="请输入密码"
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                确认密码
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="请再次输入密码"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                {isLogin ? "登录中..." : "注册中..."}
              </>
            ) : (
              <>
                <span className={styles.submitIcon}>
                  {isLogin ? "🚪" : "✨"}
                </span>
                {isLogin ? "登录游戏" : "创建账号"}
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p className={styles.switchText}>
            {isLogin ? "还没有账号？" : "已有账号？"}
            <button
              type="button"
              className={styles.switchButton}
              onClick={toggleMode}
              disabled={loading}
            >
              {isLogin ? "立即注册" : "立即登录"}
            </button>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className={styles.backgroundDecoration}>
        <div
          className={styles.decorationItem}
          style={{ top: "15%", left: "10%", animationDelay: "0s" }}
        >
          ⚔️
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "25%", right: "15%", animationDelay: "-1s" }}
        >
          🛡️
        </div>
        <div
          className={styles.decorationItem}
          style={{ bottom: "35%", left: "15%", animationDelay: "-2s" }}
        >
          💎
        </div>
        <div
          className={styles.decorationItem}
          style={{ bottom: "25%", right: "20%", animationDelay: "-3s" }}
        >
          🏆
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "45%", left: "8%", animationDelay: "-4s" }}
        >
          🌟
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "65%", right: "12%", animationDelay: "-5s" }}
        >
          ✨
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "80%", left: "25%", animationDelay: "-6s" }}
        >
          🔮
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "35%", right: "8%", animationDelay: "-7s" }}
        >
          🧙‍♂️
        </div>
        <div
          className={styles.decorationItem}
          style={{ bottom: "15%", right: "25%", animationDelay: "-8s" }}
        >
          🗡️
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
