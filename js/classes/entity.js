import { SPRITE_SIZE, TILE_SIZE, currentMap, DEBUG } from "../constants.js";
import { canvasContext, entities } from "../index.js";
import {
  normalizeVector,
  drawImage,
  drawRect,
  getTrueYPosition,
  drawText,
  checkCollision,
  getMapPosition,
} from "../utils.js";

const ACTIONS = {
  IDLE: "idle",
  WALK: "walk",
  ATTACK: "attack",
  DIE: "die",
};

const FRAME_ACTIONS = {
  IDLE: 0,
  WALK_SIDE: 1,
  ATTACK: 2,
  DIE: 3,

  IDLE_DOWN: 5,
  WALK_DOWN: 6,
  ATTACK_DOWN: 7,
  DIE_DOWN: 8,

  IDLE_UP: 10,
  WALK_UP: 11,
  ATTACK_UP: 12,
  DIE_UP: 13,
};

const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

class Entity {
  constructor(x, y, spriteSheet, id, speed, health) {
    this.id = id;
    this.x = 16 * x - 8;
    this.y = 16 * y - 8;

    this.directionX = 0;
    this.directionY = 0;
    this.currentDirection = DIRECTION.RIGHT;

    this.health = health || 3;
    this.isAlive = true;
    this.isAttacking = false; // !
    this.speed = speed || 1;

    this.width = SPRITE_SIZE;
    this.height = SPRITE_SIZE;

    this.frameAction = FRAME_ACTIONS.IDLE;
    this.frameIndex = 0;

    this.isFliped = false;

    this.spriteSheets = document.getElementById(spriteSheet);

    // setInterval(() => {
    //   this.updateFrame();
    //   !this.isAlive ? clearInterval() : null;
    // }, 1000 / 6);

    this.frameSpeed = 175;
    setInterval(() => {
      this.updateFrame();
    }, 175);
  }

  updateFrame() {
    // TODO improve dead animation
    if (!this.isAlive && this.frameIndex === 3) {
      if (this.frameIndex !== 0 && this.frameIndex !== 3) {
        this.frameIndex = 0;
      }
      if (this.frameIndex === 3) {
        this.frameIndex = 2;
      }
    }
    this.frameIndex = this.frameIndex < 3 ? ++this.frameIndex : 0;
  }

  takeDamage(damage) {
    setTimeout(() => {
      this.health -= damage;
      if (this.health <= 0) {
        this.isAlive = false;
      }
    }, this.frameSpeed);
  }

  attack(target) {
    const hurtbox = {
      x: this.x + 8 + this.directionX * 8,
      y: this.y + 8 + this.directionY * 8,
      width: 16,
      height: 16,
    };
    if (!this.isAttacking) {
      this.frameIndex = 0;
      this.isAttacking = true;

      setTimeout(() => {
        this.isAttacking = false;

        if (target) {
          const targetHitbox = {
            x: target.x,
            y: target.y,
            width: target.width,
            height: target.height,
          };

          checkCollision(hurtbox, targetHitbox) && target.takeDamage(1);
        } else {
          for (let i = 0; i < entities.length; i++) {
            if (entities[i] !== this) {
              const entityHitbox = {
                x: entities[i].x + SPRITE_SIZE / 4,
                y: entities[i].y + SPRITE_SIZE / 4,
                width: entities[i].width - SPRITE_SIZE / 2,
                height: entities[i].height - SPRITE_SIZE / 2,
              };

              if (checkCollision(hurtbox, entityHitbox)) {
                entities[i].takeDamage(1);
              }
            }
          }
        }
      }, 500);
    }
  }

  // TODO continue
  shoot() {
    const projectileDirection = {
      x: 1,
      y: 1,
    };

    entities.push(
      new Projectile(
        this.x,
        this.y,
        projectileDirection.x,
        projectileDirection.y,
        1,
        1
      )
    );
  }
  isColliding() {
    const trueXImage = this.x + SPRITE_SIZE / 4;
    const trueYImage = this.y + SPRITE_SIZE / 4;

    const posX = trueXImage;
    const posY =
      trueYImage + TILE_SIZE / 2 + 5 + this.directionY * (TILE_SIZE / 4);

    // TODO refactor using checkCollision (complex)
    // ?
    // TODO refactor using double conditions (easier)
    const collisionPoints = 3;
    for (let i = 0; i < collisionPoints; i++) {
      const currentX = posX + i * (TILE_SIZE / 3) + 3 + this.directionX * 3;

      if (DEBUG.SHOW_COLLISION) {
        drawRect(posX + i * (TILE_SIZE / 3) + 2, posY, 1, 1, "red");
      }

      if (DEBUG.SHOW_SOLIDS) {
        drawRect(
          getMapPosition(currentX) * TILE_SIZE,
          getMapPosition(posY) * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          "blue"
        );
      }
      const safeTiles = [0, 5];
      if (
        !safeTiles.includes(
          currentMap[getMapPosition(posY)][getMapPosition(currentX)]
        )
      ) {
        return true;
      }
    }
    return false;
  }

  isCollidingEntity(entity) {
    const trueX = getTrueYPosition(this.x);
    const trueY = getTrueYPosition(this.y);
    const trueEntityX = getTrueYPosition(entity.x);
    const trueEntityY = getTrueYPosition(entity.y);

    if (
      trueX + 16 > trueEntityX &&
      trueX - 16 < trueEntityX &&
      trueY + 8 > trueEntityY &&
      trueY - 8 < trueEntityY
    ) {
      return true;
    }
    return false;
  }

  animationManager() {
    const isMovingRight = this.currentDirection === DIRECTION.RIGHT;
    const isMovingLeft = this.currentDirection === DIRECTION.LEFT;
    const isMovingUp = this.currentDirection === DIRECTION.UP;
    const isMovingDown = this.currentDirection === DIRECTION.DOWN;
    const isMoving = this.directionX !== 0 || this.directionY !== 0;

    if (isMovingLeft) {
      this.isFliped = true;
    } else this.isFliped = false;

    if (this.isAlive) {
      if (isMovingRight) {
        if (!isMoving) {
          this.frameAction = FRAME_ACTIONS.IDLE;
        }
        if (isMoving) {
          this.frameAction = FRAME_ACTIONS.WALK_SIDE;
        }
        if (this.isAttacking) {
          this.frameAction = FRAME_ACTIONS.ATTACK;
        }
      }
      if (isMovingLeft) {
        if (!isMoving) {
          this.frameAction = FRAME_ACTIONS.IDLE;
        }
        if (isMoving) {
          this.frameAction = FRAME_ACTIONS.WALK_SIDE;
        }
        if (this.isAttacking) {
          this.frameAction = FRAME_ACTIONS.ATTACK;
        }
      }
      if (isMovingUp) {
        if (!isMoving) {
          this.frameAction = FRAME_ACTIONS.IDLE_UP;
        }
        if (isMoving) {
          this.frameAction = FRAME_ACTIONS.WALK_UP;
        }
        if (this.isAttacking) {
          this.frameAction = FRAME_ACTIONS.ATTACK_UP;
        }
      }
      if (isMovingDown) {
        if (!isMoving) {
          this.frameAction = FRAME_ACTIONS.IDLE_DOWN;
        }
        if (isMoving) {
          this.frameAction = FRAME_ACTIONS.WALK_DOWN;
        }
        if (this.isAttacking) {
          this.frameAction = FRAME_ACTIONS.ATTACK_DOWN;
        }
      }
    } else {
      if (isMovingRight) {
        this.frameAction = FRAME_ACTIONS.DIE;
      }
      if (isMovingLeft) {
        this.frameAction = FRAME_ACTIONS.DIE;
      }
      if (isMovingUp) {
        this.frameAction = FRAME_ACTIONS.DIE_UP;
      }
      if (isMovingDown) {
        this.frameAction = FRAME_ACTIONS.DIE_DOWN;
      }
    }
  }

  move() {
    if (!this.isAttacking) {
      const normalizedVector = normalizeVector({
        x: this.directionX,
        y: this.directionY,
      });

      if (this.directionX > 0) {
        this.currentDirection = DIRECTION.RIGHT;
      }
      if (this.directionX < 0) {
        this.currentDirection = DIRECTION.LEFT;
      }

      if (this.directionY > 0) {
        this.currentDirection = DIRECTION.DOWN;
      }
      if (this.directionY < 0) {
        this.currentDirection = DIRECTION.UP;
      }

      this.x += normalizedVector.x * this.speed;
      this.y += normalizedVector.y * this.speed;
    }
  }

  drawHitbox() {
    drawRect(
      this.x + SPRITE_SIZE / 4,
      this.y + SPRITE_SIZE / 4,
      this.width / 2,
      this.height / 2,
      "red"
    );
  }

  drawCollitionBox() {}

  drawHurtBox() {}

  draw() {
    if (DEBUG.SHOW_LABELS) {
      const textLength = canvasContext.measureText(this.id).width;
      drawText(
        this.id,
        this.x + (SPRITE_SIZE - textLength) / 2,
        this.y + SPRITE_SIZE / 4 - 2,
        10
      );
    }

    const attackDirectionX =
      this.currentDirection === DIRECTION.RIGHT
        ? 1
        : this.currentDirection === DIRECTION.LEFT
        ? -1
        : 0;
    const attackDirectionY =
      this.currentDirection === DIRECTION.DOWN
        ? 1
        : this.currentDirection === DIRECTION.UP
        ? -1
        : 0;

    if (DEBUG.SHOW_HURTBOX) {
      drawRect(
        this.x + 8 + attackDirectionX * 16,
        this.y + 8 + attackDirectionY * 16,
        16,
        16,
        "rgba(255, 0, 0, 0.5)"
      );
    }

    if (this.isFliped) {
      canvasContext.save();
      canvasContext.scale(-1, 1);
      drawImage(
        this.spriteSheets,
        this.frameIndex * SPRITE_SIZE,
        this.frameAction * SPRITE_SIZE,
        this.width,
        this.height,
        -this.x - this.width,
        this.y
      );
      canvasContext.restore();
    } else {
      drawImage(
        this.spriteSheets,
        this.frameIndex * SPRITE_SIZE,
        this.frameAction * SPRITE_SIZE,
        this.width,
        this.height,
        this.x,
        this.y
      );
    }

    if (DEBUG.SHOW_LIFE_BAR) {
      for (let i = 0; i < this.health; i++) {
        drawRect(
          this.x + SPRITE_SIZE / 2 + i * 6 - 7,
          this.y + SPRITE_SIZE - 10,
          1,
          2,
          "red"
        );
        drawRect(
          this.x + SPRITE_SIZE / 2 + 1 + i * 6 - 7,
          this.y + SPRITE_SIZE - 10 + 1,
          1,
          2,
          "red"
        );
        drawRect(
          this.x + SPRITE_SIZE / 2 + 2 + i * 6 - 7,
          this.y + SPRITE_SIZE - 10,
          1,
          2,
          "red"
        );
      }
    }
  }

  update() {
    this.animationManager();
  }
}

export default Entity;
