import Player from "./classes/player.js";
import Enemy from "./classes/enemy.js";
import {
  FPS,
  TILE_SIZE,
  currentMap,
  DEBUG,
  TILE_ID,
  changeRandomLevel,
  SPRITE_SIZE,
  IDS,
} from "./constants.js";
import { drawRect, drawImage, drawTile, drawText } from "./utils.js";

const canvas = document.getElementById("canvas");
export const canvasContext = canvas.getContext("2d");

canvas.height = currentMap.length * TILE_SIZE;
canvas.width = currentMap[0].length * TILE_SIZE;
canvasContext.imageSmoothingEnabled = false;
canvasContext.font = "10px VT323";

export let entities = [];
let running = true;
let isCompleted = false;

function update() {
  entities.sort((a, b) => a.y - b.y);

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    if (entity.id === "player") {
      const entityX = Math.floor((entity.x + SPRITE_SIZE / 2) / TILE_SIZE);
      const entityY = Math.floor((entity.y + SPRITE_SIZE / 2) / TILE_SIZE);

      if (
        isCompleted &&
        entityY > 0 &&
        currentMap[entityY - 1][entityX] === TILE_ID.DOOR
      ) {
        nextLevel();
      }
      if (!entity.isAlive) {
        // setTimeout(() => {
        gameOver();
        // running = false;
        // }, 1500);
      }
    }

    entity.update();
  }

  if (!isCompleted) {
    const isEnemiesLeft = entities.some(
      (entity) => entity.id === "enemy" && entity.isAlive
    );
    !isEnemiesLeft && (isCompleted = true);
  }
}

function resetLevel() {
  isCompleted = false;

  entities = entities.filter((entity) => {
    if (entity.id === IDS.PLAYER) {
      entity.x = 5 * 16 - 8;
      entity.y = 8 * 16 - 8;
      return true;
    }
    return false;
  });
  for (let i = 0; i < currentMap.length; i++) {
    for (let j = 0; j < currentMap[i].length; j++) {
      if (currentMap[i][j] === TILE_ID.ENEMY) {
        entities.push(new Enemy(j, i));
      }
    }
  }
}

function nextLevel() {
  changeRandomLevel();
  resetLevel();
}

function gameOver() {
  canvasContext.font = "40px VT323";
  const text = "Game Over";

  const metrics = canvasContext.measureText(text);
  const textWidth = metrics.width;
  const fontHeight =
    metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxDescent;

  canvasContext.fillStyle = "red";

  drawText(
    "Game Over",
    (canvas.width - textWidth) / 2,
    (canvas.height - fontHeight) / 2 + fontHeight / 2,
    10
  );

  // drawRect(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.05)");
}

function drawWall(row, column) {
  const tileX = column * TILE_SIZE;
  const tileY = row * TILE_SIZE;

  if (
    ((column === currentMap[row].length - 1 || column === 0) &&
      row !== currentMap.length - 1) ||
    (row > 0 &&
      row < currentMap.length - 1 &&
      currentMap[row + 1][column] === 1)
  ) {
    drawTile(12, 0, tileX, tileY);
  } else {
    drawTile(13, 1, tileX, tileY);
  }
}

const blueTiles50 = document.getElementById("blueTiles50");
let tileFrameIndex = 0;

setInterval(() => {
  tileFrameIndex < 13 ? tileFrameIndex++ : (tileFrameIndex = 0);
}, 200);

function drawGround(row, column) {
  const tileX = column * TILE_SIZE;
  const tileY = row * TILE_SIZE;

  const hasWallUp = currentMap[row - 1][column] !== 0;
  const hasWallDown = currentMap[row + 1][column] !== 0;
  const hasWallLeft = currentMap[row][column - 1] !== 0;
  const hasWallRight = currentMap[row][column + 1] !== 0;

  const hasDoorUp = currentMap[row - 1][column] === TILE_ID.DOOR;

  if (hasWallDown && hasWallLeft) {
    drawTile(0, 12, tileX, tileY);
  } else if (hasWallUp && hasWallLeft) {
    drawTile(0, 10, tileX, tileY);
  } else if (hasWallUp && hasWallRight) {
    drawTile(2, 10, tileX, tileY);
  } else if (hasWallDown && hasWallRight) {
    drawTile(2, 12, tileX, tileY);
  } else if (hasWallDown && hasWallUp) {
    drawTile(6, 12, tileX, tileY);
  } else if (hasWallLeft && hasWallRight) {
    drawTile(6, 10, tileX, tileY);
  } else if (hasWallUp) {
    drawTile(1, 10, tileX, tileY);
  } else if (hasWallDown) {
    drawTile(1, 12, tileX, tileY);
  } else if (hasWallLeft) {
    drawTile(0, 11, tileX, tileY);
  } else if (hasWallRight) {
    drawTile(2, 11, tileX, tileY);
  } else {
    drawTile(4, 11, tileX, tileY);
  }

  if (isCompleted) {
    if (hasDoorUp) {
      drawImage(
        blueTiles50,
        tileFrameIndex * TILE_SIZE,
        0,
        TILE_SIZE,
        TILE_SIZE,
        tileX,
        tileY
      );
    }
  }
}

function drawMap() {
  for (let row = 0; row < currentMap.length; row++) {
    for (let column = 0; column < currentMap[row].length; column++) {
      const tile = currentMap[row][column];

      if (tile === TILE_ID.WALL) {
        drawWall(row, column);
      } else if (tile === 2) {
        drawTile(0, 1, column * TILE_SIZE, row * TILE_SIZE);
        drawTile(11, 11, column * TILE_SIZE, row * TILE_SIZE);
      } else if (tile === 0) {
        drawGround(row, column);
      } else if (tile === 3) {
        drawTile(0, 1, column * TILE_SIZE, row * TILE_SIZE);
        drawTile(10, 11, column * TILE_SIZE, row * TILE_SIZE);
      } else if (tile === 5) {
        drawTile(0, 1, column * TILE_SIZE, row * TILE_SIZE);
      } else {
        drawRect(
          column * TILE_SIZE,
          row * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          "purple"
        );
      }
    }
  }
}

function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  if (DEBUG.SHOW_SOLIDS) {
    for (let i = 0; i < currentMap.length; i++) {
      for (let j = 0; j < currentMap[i].length; j++) {
        if (currentMap[i][j] !== 0) {
          drawRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE, "red");
        }
      }
    }
  }
}

function gameLoop() {
  gameOver();
  if (running) {
    draw();
    update();
  }
}

function createPlayer() {
  entities.push(new Player(5, 8));
}

setInterval(gameLoop, 1000 / FPS);
createPlayer();

// canvas.addEventListener("mousemove", function (event) {
//   var rect = canvas.getBoundingClientRect(); // Obtener información sobre la posición del lienzo en la ventana del navegador

//   var x = event.clientX - rect.left; // Coordenada X relativa al lienzo
//   var y = event.clientY - rect.top; // Coordenada Y relativa al lienzo
//   // Aquí puedes realizar acciones basadas en las coordenadas del mouse
// });
