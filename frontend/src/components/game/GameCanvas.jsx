// src/components/game/GameCanvas.jsx
import { useState, useEffect, useRef } from "react";
import "./GameCanvas.css";

function GameCanvas({ user, onFightEnemy, loading }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 600, y: 400 });
  const [targetPosition, setTargetPosition] = useState({ x: 600, y: 400 });
  const [isMoving, setIsMoving] = useState(false);
  const [camera, setCamera] = useState({ x: 200, y: 100 });
  const [enemies, setEnemies] = useState([]);
  const [targetEnemy, setTargetEnemy] = useState(null);

  // Map size and canvas view
  const mapSize = { width: 2400, height: 1600 };
  const canvasSize = { width: 800, height: 600 };
  const playerSpeed = 3;
  const fastMoveSpeed = 8;

  useEffect(() => {
    generateEnemies();
  }, [user.level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      startGameLoop();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const generateEnemies = () => {
    const enemyTypes = [
      { type: "Goblin", emoji: "👹", color: "#8B4513" },
      { type: "Orc", emoji: "🧌", color: "#228B22" },
      { type: "Skeleton", emoji: "💀", color: "#D3D3D3" },
      { type: "Wolf", emoji: "🐺", color: "#696969" },
      { type: "Spider", emoji: "🕷️", color: "#800080" },
    ];

    const newEnemies = [];
    for (let i = 0; i < 50; i++) {
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
    console.log(`Generated ${newEnemies.length} enemies`); // Debug log
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      updatePlayerMovement();
      updateCamera();
      drawCanvas();
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  const updatePlayerMovement = () => {
    if (!isMoving) return;

    const dx = targetPosition.x - playerPosition.x;
    const dy = targetPosition.y - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const currentSpeed = targetEnemy ? fastMoveSpeed : playerSpeed;

    if (distance < currentSpeed) {
      setPlayerPosition(targetPosition);
      setIsMoving(false);

      if (targetEnemy) {
        onFightEnemy(targetEnemy.type, targetEnemy.x, targetEnemy.y);
        setEnemies((prev) => prev.filter((e) => e.id !== targetEnemy.id));

        setTimeout(() => {
          const newEnemy = {
            ...targetEnemy,
            id: Date.now(),
            x: Math.random() * (mapSize.width - 100) + 50,
            y: Math.random() * (mapSize.height - 100) + 50,
          };
          setEnemies((prev) => [...prev, newEnemy]);
        }, 3000);

        setTargetEnemy(null);
      }
    } else {
      const moveX = (dx / distance) * currentSpeed;
      const moveY = (dy / distance) * currentSpeed;
      setPlayerPosition((prev) => ({
        x: prev.x + moveX,
        y: prev.y + moveY,
      }));
    }
  };

  const updateCamera = () => {
    const newCameraX = Math.max(
      0,
      Math.min(
        mapSize.width - canvasSize.width,
        playerPosition.x - canvasSize.width / 2
      )
    );
    const newCameraY = Math.max(
      0,
      Math.min(
        mapSize.height - canvasSize.height,
        playerPosition.y - canvasSize.height / 2
      )
    );

    setCamera({ x: newCameraX, y: newCameraY });
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawBackground(ctx);

    // Draw all enemies (remove viewport culling for debugging)
    enemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
    });

    drawPlayer(ctx);
    ctx.restore();
  };

  const drawBackground = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, mapSize.height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(0.5, "#34495e");
    gradient.addColorStop(1, "#2c3e50");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapSize.width, mapSize.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    const startX = Math.floor(camera.x / 50) * 50;
    const endX = Math.ceil((camera.x + canvasSize.width) / 50) * 50;
    const startY = Math.floor(camera.y / 50) * 50;
    const endY = Math.ceil((camera.y + canvasSize.height) / 50) * 50;

    for (let x = startX; x <= endX; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, camera.y);
      ctx.lineTo(x, camera.y + canvasSize.height);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += 50) {
      ctx.beginPath();
      ctx.moveTo(camera.x, y);
      ctx.lineTo(camera.x + canvasSize.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx) => {
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#ff6b6b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      user.gender === "male" ? "♂" : "♀",
      playerPosition.x,
      playerPosition.y
    );

    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial";
    ctx.fillText(user.displayName, playerPosition.x, playerPosition.y - 35);

    ctx.fillStyle = "#ffd700";
    ctx.font = "10px Arial";
    ctx.fillText(`Lv.${user.level}`, playerPosition.x, playerPosition.y + 35);

    if (isMoving) {
      ctx.strokeStyle = targetEnemy ? "#ff0000" : "#00ff00";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(playerPosition.x, playerPosition.y);
      ctx.lineTo(targetPosition.x, targetPosition.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const drawEnemy = (ctx, enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(enemy.emoji, enemy.x, enemy.y);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.fillText(`Lv.${enemy.level}`, enemy.x, enemy.y + 25);

    ctx.font = "8px Arial";
    ctx.fillText(enemy.type, enemy.x, enemy.y - 25);
  };

  const handleCanvasClick = (event) => {
    if (loading) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    const worldX = canvasX + camera.x;
    const worldY = canvasY + camera.y;

    const clickedEnemy = enemies.find((enemy) => {
      const distance = Math.sqrt(
        Math.pow(worldX - enemy.x, 2) + Math.pow(worldY - enemy.y, 2)
      );
      return distance <= 15;
    });

    if (clickedEnemy) {
      setTargetPosition({ x: clickedEnemy.x, y: clickedEnemy.y });
      setTargetEnemy(clickedEnemy);
      setIsMoving(true);
    } else {
      const clampedX = Math.max(20, Math.min(mapSize.width - 20, worldX));
      const clampedY = Math.max(20, Math.min(mapSize.height - 20, worldY));

      setTargetPosition({ x: clampedX, y: clampedY });
      setTargetEnemy(null);
      setIsMoving(true);
    }
  };

  const fightNearestEnemy = () => {
    if (enemies.length === 0) {
      console.log("No enemies available");
      return;
    }

    let nearestEnemy = null;
    let nearestDistance = Infinity;

    enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - enemy.x, 2) +
          Math.pow(playerPosition.y - enemy.y, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    });

    if (nearestEnemy) {
      setTargetPosition({ x: nearestEnemy.x, y: nearestEnemy.y });
      setTargetEnemy(nearestEnemy);
      setIsMoving(true);
    }
  };

  useEffect(() => {
    window.fightNearestEnemy = fightNearestEnemy;
    return () => {
      delete window.fightNearestEnemy;
    };
  }, [enemies, playerPosition]);

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
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
          <span>💡 点击移动，点击怪物战斗，或使用战斗按钮自动寻敌</span>
        </div>
        <div className="player-info">
          <span>🥟 包子: {user.buns}</span>
          <span>⚡ {user.xMultiplier}倍速</span>
          <span>📊 掉落等级: {user.lootDropLevel}</span>
          <span>
            🗺️ 位置: ({Math.floor(playerPosition.x)},{" "}
            {Math.floor(playerPosition.y)})
          </span>
          <span>👹 敌人数量: {enemies.length}</span>
        </div>
      </div>

      <div className="mini-map">
        <div className="mini-map-content">
          <div
            className="mini-map-player"
            style={{
              left: `${(playerPosition.x / mapSize.width) * 100}%`,
              top: `${(playerPosition.y / mapSize.height) * 100}%`,
            }}
          />
          <div
            className="mini-map-viewport"
            style={{
              left: `${(camera.x / mapSize.width) * 100}%`,
              top: `${(camera.y / mapSize.height) * 100}%`,
              width: `${(canvasSize.width / mapSize.width) * 100}%`,
              height: `${(canvasSize.height / mapSize.height) * 100}%`,
            }}
          />
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              className="mini-map-enemy"
              style={{
                position: "absolute",
                left: `${(enemy.x / mapSize.width) * 100}%`,
                top: `${(enemy.y / mapSize.height) * 100}%`,
                width: "2px",
                height: "2px",
                background: "#ff0000",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameCanvas;
