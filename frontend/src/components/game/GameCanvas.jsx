// src/components/game/GameCanvas.jsx
import { useState, useEffect, useRef } from "react";
import "./GameCanvas.css";

function GameCanvas({ user, onFightEnemy, loading }) {
  const canvasRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 });
  const [enemies, setEnemies] = useState([]);
  const [mapSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    generateEnemies();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [playerPosition, enemies]);

  const generateEnemies = () => {
    const enemyTypes = [
      { type: "Goblin", emoji: "👹", color: "#8B4513" },
      { type: "Orc", emoji: "🧌", color: "#228B22" },
      { type: "Skeleton", emoji: "💀", color: "#D3D3D3" },
      { type: "Wolf", emoji: "🐺", color: "#696969" },
      { type: "Spider", emoji: "🕷️", color: "#800080" },
    ];

    const newEnemies = [];
    for (let i = 0; i < 15; i++) {
      const enemyType =
        enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      newEnemies.push({
        id: i,
        ...enemyType,
        x: Math.random() * (mapSize.width - 100) + 50,
        y: Math.random() * (mapSize.height - 100) + 50,
        level: Math.max(1, user.level + Math.floor(Math.random() * 6) - 3),
      });
    }
    setEnemies(newEnemies);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground(ctx, canvas.width, canvas.height);

    // Draw enemies
    enemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
    });

    // Draw player
    drawPlayer(ctx);
  };

  const drawBackground = (ctx, width, height) => {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(0.5, "#34495e");
    gradient.addColorStop(1, "#2c3e50");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx) => {
    // Draw player circle
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#ff6b6b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw player symbol
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      user.gender === "male" ? "♂" : "♀",
      playerPosition.x,
      playerPosition.y
    );

    // Draw player name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial";
    ctx.fillText(user.displayName, playerPosition.x, playerPosition.y - 35);

    // Draw level
    ctx.fillStyle = "#ffd700";
    ctx.font = "10px Arial";
    ctx.fillText(`Lv.${user.level}`, playerPosition.x, playerPosition.y + 35);
  };

  const drawEnemy = (ctx, enemy) => {
    // Draw enemy
    ctx.fillStyle = enemy.color;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw enemy emoji
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(enemy.emoji, enemy.x, enemy.y);

    // Draw enemy level
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.fillText(`Lv.${enemy.level}`, enemy.x, enemy.y + 25);

    // Draw enemy type
    ctx.font = "8px Arial";
    ctx.fillText(enemy.type, enemy.x, enemy.y - 25);
  };

  const handleCanvasClick = (event) => {
    if (loading) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check if clicked on an enemy
    const clickedEnemy = enemies.find((enemy) => {
      const distance = Math.sqrt(
        Math.pow(clickX - enemy.x, 2) + Math.pow(clickY - enemy.y, 2)
      );
      return distance <= 15;
    });

    if (clickedEnemy) {
      // Fight enemy
      onFightEnemy(clickedEnemy.type, clickedEnemy.x, clickedEnemy.y);

      // Remove enemy temporarily (it will respawn)
      setEnemies((prev) => prev.filter((e) => e.id !== clickedEnemy.id));

      // Respawn enemy after 3 seconds
      setTimeout(() => {
        const newEnemy = {
          ...clickedEnemy,
          id: Date.now(), // New ID
          x: Math.random() * (mapSize.width - 100) + 50,
          y: Math.random() * (mapSize.height - 100) + 50,
        };
        setEnemies((prev) => [...prev, newEnemy]);
      }, 3000);
    } else {
      // Move player
      setPlayerPosition({ x: clickX, y: clickY });
    }
  };

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        width={mapSize.width}
        height={mapSize.height}
        onClick={handleCanvasClick}
        className="game-canvas"
      />

      {loading && (
        <div className="canvas-loading">
          <div className="combat-animation">⚔️</div>
          <p>战斗中...</p>
        </div>
      )}

      <div className="canvas-controls">
        <div className="control-hint">
          <span>💡 点击空地移动，点击怪物战斗</span>
        </div>
        <div className="player-info">
          <span>🥟 包子: {user.buns}</span>
          <span>⚡ {user.xMultiplier}倍速</span>
          <span>📊 掉落等级: {user.lootDropLevel}</span>
        </div>
      </div>
    </div>
  );
}

export default GameCanvas;
