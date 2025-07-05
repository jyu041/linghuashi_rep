// src/components/InitialSelection.jsx
import { useState } from "react";
import styles from "./InitialSelection.module.css";

function InitialSelection({ user, token, onComplete }) {
  const [selectedGender, setSelectedGender] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGender) {
      setError("请选择性别");
      return;
    }

    if (!displayName.trim()) {
      setError("请输入显示名称");
      return;
    }

    if (displayName.trim().length < 2 || displayName.trim().length > 20) {
      setError("显示名称长度应在2-20个字符之间");
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
            gender: selectedGender,
            displayName: displayName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        onComplete(data.user);
      } else {
        setError(data.message || "设置失败，请重试");
      }
    } catch (error) {
      console.error("Initial selection error:", error);
      setError("网络错误，请检查连接后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.selectionContainer}>
      <div className={styles.selectionCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>角色设置</h1>
          <p className={styles.subtitle}>完善您的角色信息以开始游戏</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.selectionForm}>
          {/* Gender Selection */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>选择性别</label>
            <div className={styles.genderOptions}>
              <button
                type="button"
                className={`${styles.genderButton} ${
                  selectedGender === "male" ? styles.selected : ""
                }`}
                onClick={() => setSelectedGender("male")}
              >
                <span className={styles.genderIcon}>♂</span>
                <span className={styles.genderText}>男性</span>
              </button>
              <button
                type="button"
                className={`${styles.genderButton} ${
                  selectedGender === "female" ? styles.selected : ""
                }`}
                onClick={() => setSelectedGender("female")}
              >
                <span className={styles.genderIcon}>♀</span>
                <span className={styles.genderText}>女性</span>
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className={styles.formGroup}>
            <label htmlFor="displayName" className={styles.formLabel}>
              显示名称
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={styles.nameInput}
              placeholder="输入您的游戏昵称"
              maxLength={20}
              disabled={loading}
            />
            <div className={styles.characterCount}>{displayName.length}/20</div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !selectedGender || !displayName.trim()}
          >
            {loading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                创建角色中...
              </>
            ) : (
              <>
                <span className={styles.submitIcon}>🚀</span>
                开始游戏
              </>
            )}
          </button>
        </form>

        {/* Preview Section */}
        {(selectedGender || displayName) && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>角色预览</h3>
            <div className={styles.characterPreview}>
              <div className={styles.avatar}>
                {selectedGender === "male"
                  ? "♂"
                  : selectedGender === "female"
                  ? "♀"
                  : "?"}
              </div>
              <div className={styles.previewInfo}>
                <div className={styles.previewName}>
                  {displayName || "未设置昵称"}
                </div>
                <div className={styles.previewGender}>
                  {selectedGender === "male"
                    ? "男性角色"
                    : selectedGender === "female"
                    ? "女性角色"
                    : "未选择性别"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className={styles.backgroundDecoration}>
        <div
          className={styles.decorationItem}
          style={{ top: "10%", left: "10%" }}
        >
          ⚔️
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "20%", right: "15%" }}
        >
          🛡️
        </div>
        <div
          className={styles.decorationItem}
          style={{ bottom: "30%", left: "20%" }}
        >
          💎
        </div>
        <div
          className={styles.decorationItem}
          style={{ bottom: "20%", right: "20%" }}
        >
          🏆
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "50%", left: "5%" }}
        >
          ✨
        </div>
        <div
          className={styles.decorationItem}
          style={{ top: "60%", right: "10%" }}
        >
          🌟
        </div>
      </div>
    </div>
  );
}

export default InitialSelection;
