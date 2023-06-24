import { entities } from "../index.js";
import { drawRect, normalizeVector } from "../utils.js";

class Projectile {
  constructor(x, y, directionX, directionY, speed, damage) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.speed = speed;
    this.damage = damage;

    this.distance = 0;
  }

  move() {
    const normalizedVector = normalizeVector({
      x: this.directionX,
      y: this.directionY,
    });

    this.x += normalizedVector.x * this.speed;
    this.y += normalizedVector.y * this.speed;
    this.distance++;
  }

  draw() {
    drawRect(this.x, this.y, 10, 10, "red");
  }

  update() {
    this.draw();
    this.move();
    if (this.distance > 50) {
      entities.splice(entities.indexOf(this), 1);
    }
  }
}

export default Projectile;
