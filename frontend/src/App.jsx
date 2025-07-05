// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styles from "./App.module.css";
import LoginPage from "./components/auth/LoginPage";
import InitialSelection from "./components/auth/InitialSelection";
import GameHomePage from "./components/game/GameHomePage";
import AdminPage from "./components/admin/AdminPage";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to validate token with backend
  const validateToken = async (storedToken) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.user;
        }
      }
      return null;
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      // Check for existing authentication
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Validate token with backend
          const validUser = await validateToken(storedToken);

          if (validUser) {
            // Token is still valid
            setToken(storedToken);
            setUser(validUser);
            // Update localStorage with fresh user data
            localStorage.setItem("user", JSON.stringify(validUser));
          } else {
            // Token expired or invalid, clear storage
            console.log("Token invalid or expired, clearing authentication");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error validating authentication:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const handleInitialSelectionComplete = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Function to handle token expiry during gameplay
  const handleTokenError = () => {
    console.log("Token error detected, logging out");
    handleLogout();
  };

  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !user ? (
                <LoginPage onLogin={handleLogin} />
              ) : user.needsInitialSelection ? (
                <Navigate to="/initial-selection" replace />
              ) : (
                <Navigate to="/game" replace />
              )
            }
          />

          {/* Initial Selection Route */}
          <Route
            path="/initial-selection"
            element={
              user && user.needsInitialSelection ? (
                <InitialSelection
                  user={user}
                  token={token}
                  onComplete={handleInitialSelectionComplete}
                  onTokenError={handleTokenError}
                />
              ) : user ? (
                <Navigate to="/game" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Game Route */}
          <Route
            path="/game"
            element={
              user && !user.needsInitialSelection ? (
                <GameHomePage
                  user={user}
                  token={token}
                  onLogout={handleLogout}
                  onTokenError={handleTokenError}
                />
              ) : user ? (
                <Navigate to="/initial-selection" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <AdminPage
                  user={user}
                  token={token}
                  onLogout={handleLogout}
                  onTokenError={handleTokenError}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              user ? (
                user.needsInitialSelection ? (
                  <Navigate to="/initial-selection" replace />
                ) : (
                  <Navigate to="/game" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
