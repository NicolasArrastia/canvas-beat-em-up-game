import {
  CONTROLLERS,
  DEBUG,
  IDS,
  currentMap,
  SPRITE_SIZE,
} from "../constants.js";
import { entities } from "../index.js";
import { drawRect, getMapPosition, getTrueYPosition } from "../utils.js";
import Entity from "./entity.js";
import Pathfinder from "./pathfinder.js";

let pathfinder;
class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, "enemyAxeKnightFrames", IDS.ENEMY, 0.5, 1);
    pathfinder = new Pathfinder();
  }

  moveController(target) {
    const truePlayerX = getTrueYPosition(target.x);
    const truePlayerY = getTrueYPosition(target.y);
    const trueX = getTrueYPosition(this.x);
    const trueY = getTrueYPosition(this.y);

    if (!(truePlayerY > trueY + 3 || truePlayerY < trueY - 3)) {
      this.directionY = 0;
    } else {
      this.directionY = truePlayerY > trueY ? 1 : -1;
    }

    if (!(truePlayerX > trueX + 3 || truePlayerX < trueX - 3)) {
      this.directionX = 0;
    } else {
      this.directionX = truePlayerX > trueX ? 1 : -1;
    }

    if (this.isCollidingEntity(target)) {
      this.directionX = 0;
      this.directionY = 0;
      this.attack();
    }
  }

  update() {
    if (this.isAlive) {
      entities.forEach((entity) => {
        if (entity.id === IDS.PLAYER) {
          this.moveController(entity);
        }
      });

      if (!this.isColliding()) {
        this.move();
      }
    }
    this.draw();
    super.update();
  }
}

export default Enemy;
