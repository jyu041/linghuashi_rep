// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./components/auth/LoginPage";
import InitialSelection from "./components/auth/InitialSelection";
import GameHomePage from "./components/game/GameHomePage";
import AdminPage from "./components/admin/AdminPage";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setIsAdmin(false);
  };

  const handleInitialSelection = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Check for admin page access
  if (window.location.pathname === "/admin" && token) {
    return <AdminPage token={token} onLogout={handleLogout} />;
  }

  // Not logged in
  if (!token || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Logged in but needs initial selection
  if (!user.initialSelectionComplete) {
    return (
      <InitialSelection token={token} onComplete={handleInitialSelection} />
    );
  }

  // Main game
  return <GameHomePage user={user} token={token} onLogout={handleLogout} />;
}

export default App;
