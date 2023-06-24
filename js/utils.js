import { SPRITE_SIZE, TILE_SIZE } from "./constants.js";
import { canvasContext } from "./index.js";

export function drawImage(
  spriteImage,
  spriteX,
  spriteY,
  spriteWidth,
  spriteHeight,
  canvasX,
  canvasY
) {
  canvasContext.drawImage(
    spriteImage,
    spriteX,
    spriteY,
    spriteWidth,
    spriteHeight,
    canvasX,
    canvasY,
    spriteWidth,
    spriteHeight
  );
}

export function drawRect(x, y, width, height, color, innerColor) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

const tileset = document.getElementById("tileset");
export function drawTile(x, y, positionX, positionY) {
  drawImage(
    tileset,
    TILE_SIZE * x,
    TILE_SIZE * y,
    TILE_SIZE,
    TILE_SIZE,
    positionX,
    positionY
  );
}

export function drawText(text, x, y, font, color) {
  canvasContext.font = `${font || 10}px VT323`;
  canvasContext.fillStyle = color || "black";
  canvasContext.fillText(text, x, y);
}

export function drawCircle(x, y, radius, color, isHollow) {
  canvasContext.beginPath();
  canvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";
  canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
  if (!isHollow) {
    canvasContext.fill();
  }
  canvasContext.closePath();
}

export function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  if (magnitude !== 0) {
    const normalizedVector = {
      x: vector.x / magnitude,
      y: vector.y / magnitude,
    };
    return normalizedVector;
  }

  return vector;
}

export function getTrueXPosition(x) {
  return x + SPRITE_SIZE / 4;
}

export function getTrueYPosition(y) {
  return y + SPRITE_SIZE / 4 + 4;
}

export function checkCollision(square1, square2) {
  if (
    square1.x < square2.x + square2.width &&
    square1.x + square1.width > square2.x &&
    square1.y < square2.y + square2.height &&
    square1.y + square1.height > square2.y
  ) {
    return true; // Colisión detectada
  }
  return false; // No hay colisión
}

export function getMapPosition(position) {
  return Math.floor(position / TILE_SIZE);
}
