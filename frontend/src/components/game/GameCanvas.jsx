// src/components/game/GameCanvas.jsx
import { useRef, useEffect, useCallback, useState } from "react";
import styles from "./GameCanvas.module.css";

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

  // Resize canvas to fill entire viewport minus navigation areas
  useEffect(() => {
    const updateCanvasSize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight - 80; // Subtract top navigation height

      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Initialize enemies with proper names and icons
  useEffect(() => {
    const gameState = gameStateRef.current;
    if (gameState.enemies.length === 0) {
      const enemyTypes = [
        {
          type: "Goblin",
          emoji: "👺",
          color: "#228B22",
          namePool: ["小妖", "哥布林", "绿皮怪"],
        },
        {
          type: "Orc",
          emoji: "👹",
          color: "#8B4513",
          namePool: ["兽人", "野蛮人", "强盗"],
        },
        {
          type: "Skeleton",
          emoji: "💀",
          color: "#F5F5DC",
          namePool: ["骷髅", "亡灵", "白骨"],
        },
        {
          type: "Slime",
          emoji: "🟢",
          color: "#32CD32",
          namePool: ["史莱姆", "胶体", "软泥怪"],
        },
      ];

      // Generate initial enemies
      for (let i = 0; i < 15; i++) {
        const enemyType =
          enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = {
          id: `enemy_${i}`,
          x: Math.random() * (mapSize.width - 200) + 100,
          y: Math.random() * (mapSize.height - 200) + 100,
          type: enemyType.type,
          name: enemyType.namePool[
            Math.floor(Math.random() * enemyType.namePool.length)
          ],
          level: Math.max(1, user.level + Math.floor(Math.random() * 6) - 3),
          color: enemyType.color,
          emoji: enemyType.emoji,
        };
        gameState.enemies.push(enemy);
      }
    }
  }, [user.level]);

  // Spawn new enemy to replace killed one
  const spawnNewEnemy = useCallback(() => {
    const gameState = gameStateRef.current;
    const enemyTypes = [
      {
        type: "Goblin",
        emoji: "👺",
        color: "#228B22",
        namePool: ["小妖", "哥布林", "绿皮怪"],
      },
      {
        type: "Orc",
        emoji: "👹",
        color: "#8B4513",
        namePool: ["兽人", "野蛮人", "强盗"],
      },
      {
        type: "Skeleton",
        emoji: "💀",
        color: "#F5F5DC",
        namePool: ["骷髅", "亡灵", "白骨"],
      },
      {
        type: "Slime",
        emoji: "🟢",
        color: "#32CD32",
        namePool: ["史莱姆", "胶体", "软泥怪"],
      },
    ];

    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const newEnemy = {
      id: `enemy_${Date.now()}_${Math.random()}`,
      x: Math.random() * (mapSize.width - 200) + 100,
      y: Math.random() * (mapSize.height - 200) + 100,
      type: enemyType.type,
      name: enemyType.namePool[
        Math.floor(Math.random() * enemyType.namePool.length)
      ],
      level: Math.max(1, user.level + Math.floor(Math.random() * 6) - 3),
      color: enemyType.color,
      emoji: enemyType.emoji,
    };

    gameState.enemies.push(newEnemy);
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
  }, [canvasSize]);

  const handleCanvasClick = useCallback((event) => {
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
      // Attack enemy
      gameState.targetEnemy = clickedEnemy;
      gameState.targetPosition = { x: clickedEnemy.x - 30, y: clickedEnemy.y };
      gameState.isMoving = true;
    } else {
      // Move to position
      gameState.targetPosition = { x: worldX, y: worldY };
      gameState.targetEnemy = null;
      gameState.isMoving = true;
    }
  }, []);

  const fightNearestEnemy = useCallback(async () => {
    if (user.buns <= 0) {
      alert("包子不足，无法战斗！");
      return;
    }

    const gameState = gameStateRef.current;
    const now = Date.now();
    if (gameState.lastFightTime && now - gameState.lastFightTime < 1000) {
      return; // Cooldown
    }

    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDistance = Infinity;

    gameState.enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - gameState.playerPosition.x, 2) +
          Math.pow(enemy.y - gameState.playerPosition.y, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    });

    if (nearestEnemy) {
      gameState.lastFightTime = now;
      setLoading(true);

      try {
        const response = await onFightEnemy(
          nearestEnemy.type,
          nearestEnemy.x,
          nearestEnemy.y
        );

        // Remove the defeated enemy
        gameState.enemies = gameState.enemies.filter(
          (e) => e.id !== nearestEnemy.id
        );

        // Spawn a new enemy
        spawnNewEnemy();
      } catch (error) {
        console.error("Fight failed:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user.buns, onFightEnemy, spawnNewEnemy]);

  const updatePlayerMovement = () => {
    const gameState = gameStateRef.current;
    if (!gameState.isMoving) return;

    const dx = gameState.targetPosition.x - gameState.playerPosition.x;
    const dy = gameState.targetPosition.y - gameState.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      gameState.isMoving = false;
      if (gameState.targetEnemy) {
        // Fight the enemy when reached
        fightNearestEnemy();
        gameState.targetEnemy = null;
      }
      return;
    }

    const speed = 3;
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    gameState.playerPosition.x += vx;
    gameState.playerPosition.y += vy;
  };

  const updateCamera = () => {
    const gameState = gameStateRef.current;
    const targetCameraX = gameState.playerPosition.x - canvasSize.width / 2;
    const targetCameraY = gameState.playerPosition.y - canvasSize.height / 2;

    // Clamp camera to map bounds
    gameState.camera.x = Math.max(
      0,
      Math.min(mapSize.width - canvasSize.width, targetCameraX)
    );
    gameState.camera.y = Math.max(
      0,
      Math.min(mapSize.height - canvasSize.height, targetCameraY)
    );
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = "rgba(26, 26, 46, 1)";
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Save context for camera transform
    ctx.save();
    ctx.translate(-gameState.camera.x, -gameState.camera.y);

    // Draw map background pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < mapSize.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapSize.height);
      ctx.stroke();
    }
    for (let y = 0; y < mapSize.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapSize.width, y);
      ctx.stroke();
    }

    // Draw enemies
    gameState.enemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
    });

    // Draw player
    drawPlayer(ctx, gameState);

    // Restore context
    ctx.restore();
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
    ctx.font = "bold 18px Arial";
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

    // Draw enemy name
    ctx.font = "8px Arial";
    ctx.fillText(enemy.name, enemy.x, enemy.y - 30);
  };

  // Expose fight function globally for bottom navigation
  useEffect(() => {
    window.fightNearestEnemy = fightNearestEnemy;
    return () => {
      delete window.fightNearestEnemy;
    };
  }, [fightNearestEnemy]);

  return (
    <div className={styles.gameCanvasContainer}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className={styles.gameCanvas}
      />

      {loading && (
        <div className={styles.canvasLoading}>
          <div className={styles.combatAnimation}>⚔️</div>
          <p>战斗中...</p>
        </div>
      )}
    </div>
  );
}

export default GameCanvas;
