// src/components/game/GameCanvas.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import "./GameCanvas.css";

function GameCanvas({ user, onFightEnemy, loading }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gameStateRef = useRef({
    playerPosition: { x: 600, y: 400 },
    targetPosition: { x: 600, y: 400 },
    isMoving: false,
    camera: { x: 200, y: 100 },
    enemies: [],
    targetEnemy: null,
  });

  const [canvasReady, setCanvasReady] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Map size and canvas view
  const mapSize = { width: 2400, height: 1600 };
  const canvasSize = { width: 800, height: 600 };
  const playerSpeed = 4;
  const fastMoveSpeed = 10;

  // Initialize canvas and enemies
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      generateEnemies();
      setCanvasReady(true);
    }
  }, []);

  const generateEnemies = useCallback(() => {
    const enemyTypes = [
      { type: "Goblin", emoji: "👹", color: "#8B4513" },
      { type: "Orc", emoji: "🧌", color: "#228B22" },
      { type: "Skeleton", emoji: "💀", color: "#D3D3D3" },
      { type: "Wolf", emoji: "🐺", color: "#696969" },
      { type: "Spider", emoji: "🕷️", color: "#800080" },
    ];

    const newEnemies = [];
    for (let i = 0; i < 25; i++) {
      const enemyType =
        enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemy = {
        id: `enemy_${i}_${Date.now()}`,
        ...enemyType,
        x: Math.random() * (mapSize.width - 200) + 100,
        y: Math.random() * (mapSize.height - 200) + 100,
        level: Math.max(1, user.level + Math.floor(Math.random() * 6) - 3),
      };
      newEnemies.push(enemy);
    }

    gameStateRef.current.enemies = newEnemies;
    setForceUpdate((prev) => prev + 1); // Force re-render
  }, [user.level]);

  // Start game loop only once when canvas is ready
  useEffect(() => {
    if (!canvasReady) return;

    const gameLoop = () => {
      updatePlayerMovement();
      updateCamera();
      drawCanvas();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasReady]); // Only depend on canvasReady

  const updatePlayerMovement = () => {
    const gameState = gameStateRef.current;
    if (!gameState.isMoving) return;

    const dx = gameState.targetPosition.x - gameState.playerPosition.x;
    const dy = gameState.targetPosition.y - gameState.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const currentSpeed = gameState.targetEnemy ? fastMoveSpeed : playerSpeed;

    if (distance < currentSpeed) {
      gameState.playerPosition = { ...gameState.targetPosition };
      gameState.isMoving = false;

      if (gameState.targetEnemy) {
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

    // Draw UI info
    drawUIInfo(ctx, gameState);
  };

  const drawBackground = (ctx) => {
    // Draw world background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, mapSize.height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(0.5, "#34495e");
    gradient.addColorStop(1, "#2c3e50");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapSize.width, mapSize.height);

    // Draw grid pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= mapSize.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapSize.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= mapSize.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapSize.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx, gameState) => {
    // Player circle
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#ff6b6b";
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

    // Player symbol
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
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

  const drawUIInfo = (ctx, gameState) => {
    // Draw UI information overlay (not affected by camera)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 200, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`敌人数量: ${gameState.enemies.length}`, 15, 25);
    ctx.fillText(
      `坐标: (${Math.floor(gameState.playerPosition.x)}, ${Math.floor(
        gameState.playerPosition.y
      )})`,
      15,
      40
    );
    ctx.fillText(`移动状态: ${gameState.isMoving ? "移动中" : "静止"}`, 15, 55);
  };

  const handleCanvasClick = useCallback(
    (event) => {
      if (loading) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const canvasX = (event.clientX - rect.left) * scaleX;
      const canvasY = (event.clientY - rect.top) * scaleY;

      // Convert to world coordinates
      const worldX = canvasX + gameStateRef.current.camera.x;
      const worldY = canvasY + gameStateRef.current.camera.y;

      // Check for enemy clicks with larger hit area
      const clickedEnemy = gameStateRef.current.enemies.find((enemy) => {
        const distance = Math.sqrt(
          Math.pow(worldX - enemy.x, 2) + Math.pow(worldY - enemy.y, 2)
        );
        return distance <= 30; // Larger hit area for easier clicking
      });

      if (clickedEnemy) {
        console.log("Attacking enemy:", clickedEnemy);
        gameStateRef.current.targetPosition = {
          x: clickedEnemy.x,
          y: clickedEnemy.y,
        };
        gameStateRef.current.targetEnemy = clickedEnemy;
        gameStateRef.current.isMoving = true;
      } else {
        // Move to clicked position
        const clampedX = Math.max(25, Math.min(mapSize.width - 25, worldX));
        const clampedY = Math.max(25, Math.min(mapSize.height - 25, worldY));

        console.log("Moving to:", clampedX, clampedY);
        gameStateRef.current.targetPosition = { x: clampedX, y: clampedY };
        gameStateRef.current.targetEnemy = null;
        gameStateRef.current.isMoving = true;
      }
    },
    [loading]
  );

  const fightNearestEnemy = useCallback(() => {
    const gameState = gameStateRef.current;
    if (gameState.enemies.length === 0) {
      alert("附近没有敌人！");
      return;
    }

    let nearestEnemy = null;
    let nearestDistance = Infinity;

    gameState.enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(gameState.playerPosition.x - enemy.x, 2) +
          Math.pow(gameState.playerPosition.y - enemy.y, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    });

    if (nearestEnemy) {
      console.log("Fighting nearest enemy:", nearestEnemy);
      gameState.targetPosition = { x: nearestEnemy.x, y: nearestEnemy.y };
      gameState.targetEnemy = nearestEnemy;
      gameState.isMoving = true;
    }
  }, []);

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

      <div className="canvas-controls">
        <div className="control-hint">
          <span>💡 点击移动，点击怪物战斗，或使用战斗按钮自动寻敌</span>
        </div>
        <div className="player-info">
          <span>🥟 包子: {user.buns}</span>
          <span>⚡ {user.xMultiplier}倍速</span>
          <span>📊 掉落等级: {user.lootDropLevel}</span>
          <span>👹 敌人: {gameStateRef.current.enemies.length}</span>
        </div>
      </div>
    </div>
  );
}

export default GameCanvas;
