// src/components/game/GameCanvas.jsx
import { useRef, useEffect, useCallback, useState } from "react";
import "./GameCanvas.css";

function GameCanvas({ user, onFightEnemy, onUserUpdate }) {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    playerPosition: { x: 400, y: 300 },
    targetPosition: { x: 400, y: 300 },
    isMoving: false,
    targetEnemy: null,
    enemies: [],
    camera: { x: 0, y: 0 },
    lastFightTime: 0,
  });

  const [loading, setLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const mapSize = { width: 1600, height: 1200 };

  // Resize canvas to fit container
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Initialize enemies
  useEffect(() => {
    const gameState = gameStateRef.current;
    if (gameState.enemies.length === 0) {
      // Generate initial enemies
      for (let i = 0; i < 15; i++) {
        const enemy = {
          id: `enemy_${i}`,
          x: Math.random() * (mapSize.width - 200) + 100,
          y: Math.random() * (mapSize.height - 200) + 100,
          type: Math.random() > 0.7 ? "Orc" : "Goblin",
          level: Math.max(1, user.level + Math.floor(Math.random() * 6) - 3),
          color: Math.random() > 0.7 ? "#8B4513" : "#228B22",
          emoji: Math.random() > 0.7 ? "👹" : "👺",
        };
        gameState.enemies.push(enemy);
      }
    }
  }, [user.level]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updatePlayerMovement();
      updateCamera();
      drawCanvas();
    };

    const interval = setInterval(gameLoop, 16); // 60 FPS
    return () => clearInterval(interval);
  }, []);

  const handleCanvasClick = useCallback(
    (event) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const gameState = gameStateRef.current;
      const worldX = x + gameState.camera.x;
      const worldY = y + gameState.camera.y;

      // Check if clicked on an enemy
      const clickedEnemy = gameState.enemies.find((enemy) => {
        const distance = Math.sqrt(
          Math.pow(enemy.x - worldX, 2) + Math.pow(enemy.y - worldY, 2)
        );
        return distance < 25;
      });

      if (clickedEnemy) {
        // Check cooldown and buns
        const now = Date.now();
        if (now - gameState.lastFightTime < 1000) {
          return; // Cooldown active
        }

        if (user.buns <= 0) {
          alert("包子不足，无法战斗！");
          return;
        }

        gameState.targetPosition = { x: clickedEnemy.x, y: clickedEnemy.y };
        gameState.targetEnemy = clickedEnemy;
        gameState.isMoving = true;
      } else {
        // Move to clicked position
        gameState.targetPosition = { x: worldX, y: worldY };
        gameState.targetEnemy = null;
        gameState.isMoving = true;
      }
    },
    [user.buns]
  );

  const fightNearestEnemy = useCallback(() => {
    // Check cooldown and buns
    const now = Date.now();
    if (now - gameStateRef.current.lastFightTime < 1000) {
      return; // Cooldown active
    }

    if (user.buns <= 0) {
      alert("包子不足，无法战斗！");
      return;
    }

    const gameState = gameStateRef.current;
    const playerPos = gameState.playerPosition;

    // Find nearest enemy
    let nearestEnemy = null;
    let minDistance = Infinity;

    gameState.enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - playerPos.x, 2) + Math.pow(enemy.y - playerPos.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    });

    if (nearestEnemy) {
      gameState.targetPosition = { x: nearestEnemy.x, y: nearestEnemy.y };
      gameState.targetEnemy = nearestEnemy;
      gameState.isMoving = true;
    }
  }, [user.buns]);

  const updatePlayerMovement = () => {
    const gameState = gameStateRef.current;
    if (!gameState.isMoving) return;

    const dx = gameState.targetPosition.x - gameState.playerPosition.x;
    const dy = gameState.targetPosition.y - gameState.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const playerSpeed = 3;
    const fastMoveSpeed = 8;
    const currentSpeed = gameState.targetEnemy ? fastMoveSpeed : playerSpeed;

    if (distance < currentSpeed) {
      gameState.playerPosition = { ...gameState.targetPosition };
      gameState.isMoving = false;

      if (gameState.targetEnemy) {
        // Set cooldown
        gameState.lastFightTime = Date.now();

        // Fight the enemy
        onFightEnemy(
          gameState.targetEnemy.type,
          gameState.targetEnemy.x,
          gameState.targetEnemy.y
        );

        // Remove the fought enemy
        gameState.enemies = gameState.enemies.filter(
          (e) => e.id !== gameState.targetEnemy.id
        );

        // Respawn enemy after delay
        setTimeout(() => {
          const newEnemy = {
            ...gameState.targetEnemy,
            id: `enemy_respawn_${Date.now()}`,
            x: Math.random() * (mapSize.width - 200) + 100,
            y: Math.random() * (mapSize.height - 200) + 100,
          };
          gameState.enemies.push(newEnemy);
        }, 3000);

        gameState.targetEnemy = null;
      }
    } else {
      const moveX = (dx / distance) * currentSpeed;
      const moveY = (dy / distance) * currentSpeed;

      gameState.playerPosition = {
        x: gameState.playerPosition.x + moveX,
        y: gameState.playerPosition.y + moveY,
      };
    }
  };

  const updateCamera = () => {
    const gameState = gameStateRef.current;
    const newCameraX = Math.max(
      0,
      Math.min(
        mapSize.width - canvasSize.width,
        gameState.playerPosition.x - canvasSize.width / 2
      )
    );
    const newCameraY = Math.max(
      0,
      Math.min(
        mapSize.height - canvasSize.height,
        gameState.playerPosition.y - canvasSize.height / 2
      )
    );

    gameState.camera = { x: newCameraX, y: newCameraY };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context and apply camera transform
    ctx.save();
    ctx.translate(-gameState.camera.x, -gameState.camera.y);

    // Draw background
    drawBackground(ctx);

    // Draw all enemies
    gameState.enemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
    });

    // Draw player
    drawPlayer(ctx, gameState);

    // Restore context
    ctx.restore();
  };

  const drawBackground = (ctx) => {
    // Draw world background with gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      mapSize.width,
      mapSize.height
    );
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#0f3460");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapSize.width, mapSize.height);

    // Draw grid for reference
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < mapSize.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapSize.height);
      ctx.stroke();
    }
    for (let y = 0; y < mapSize.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapSize.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx, gameState) => {
    // Draw player circle
    ctx.fillStyle = "#4CAF50";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
      gameState.playerPosition.x,
      gameState.playerPosition.y,
      20,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();

    // Draw player symbol
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      user.gender === "male" ? "♂" : "♀",
      gameState.playerPosition.x,
      gameState.playerPosition.y
    );

    // Player name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial";
    ctx.fillText(
      user.displayName,
      gameState.playerPosition.x,
      gameState.playerPosition.y - 35
    );

    // Player level
    ctx.fillStyle = "#ffd700";
    ctx.font = "10px Arial";
    ctx.fillText(
      `Lv.${user.level}`,
      gameState.playerPosition.x,
      gameState.playerPosition.y + 35
    );

    // Movement indicator
    if (gameState.isMoving) {
      ctx.strokeStyle = gameState.targetEnemy ? "#ff0000" : "#00ff00";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(gameState.playerPosition.x, gameState.playerPosition.y);
      ctx.lineTo(gameState.targetPosition.x, gameState.targetPosition.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const drawEnemy = (ctx, enemy) => {
    // Draw enemy circle
    ctx.fillStyle = enemy.color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw enemy emoji/symbol
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(enemy.emoji, enemy.x, enemy.y);

    // Draw enemy level
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.fillText(`Lv.${enemy.level}`, enemy.x, enemy.y + 30);

    // Draw enemy type
    ctx.font = "8px Arial";
    ctx.fillText(enemy.type, enemy.x, enemy.y - 30);
  };

  // Expose fight function globally for bottom navigation
  useEffect(() => {
    window.fightNearestEnemy = fightNearestEnemy;
    return () => {
      delete window.fightNearestEnemy;
    };
  }, [fightNearestEnemy]);

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

      {/* <div className="canvas-controls">
        <div className="control-hint">
          <span>💡 点击移动，点击怪物战斗，或使用战斗按钮自动寻敌</span>
        </div>
        <div className="player-info">
          <span>🥟 包子: {user.buns}</span>
          <span>⚡ {user.xMultiplier}倍速</span>
          <span>📊 掉落等级: {user.lootDropLevel}</span>
          <span>👹 敌人: {gameStateRef.current.enemies.length}</span>
        </div>
      </div> */}
    </div>
  );
}

export default GameCanvas;
