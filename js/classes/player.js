import { CONTROLLERS, IDS, KEY_CODES, SPRITE_SIZE } from "../constants.js";
import { drawCircle } from "../utils.js";
import Entity from "./entity.js";

const arrows = document.getElementById("arrows");

class Player extends Entity {
  constructor(x, y) {
    super(x, y, "playerFrames", IDS.PLAYER, 1.5);
    window.addEventListener("keydown", (e) => {
      let key = e.keyCode;

      if (CONTROLLERS.PLAYER_1.LEFT.includes(key)) {
        this.directionX = -1;
      }
      if (CONTROLLERS.PLAYER_1.UP.includes(key)) {
        this.directionY = -1;
      }
      if (CONTROLLERS.PLAYER_1.RIGHT.includes(key)) {
        this.directionX = 1;
      }
      if (CONTROLLERS.PLAYER_1.DOWN.includes(key)) {
        this.directionY = 1;
      }
    });

    window.addEventListener("keyup", (e) => {
      let key = e.keyCode;

      if (CONTROLLERS.PLAYER_1.LEFT.includes(key)) {
        this.directionX = 0;
      }
      if (CONTROLLERS.PLAYER_1.UP.includes(key)) {
        this.directionY = 0;
      }
      if (CONTROLLERS.PLAYER_1.RIGHT.includes(key)) {
        this.directionX = 0;
      }
      if (CONTROLLERS.PLAYER_1.DOWN.includes(key)) {
        this.directionY = 0;
      }
    });

    window.addEventListener("keypress", (e) => {
      let key = e.keyCode;

      if (key === KEY_CODES.ENTER) {
        this.attack();
      }

      // R
      // if (key === 114) {
      //   this.isAlive = false;
      // }
    });
  }

  update() {
    if (!this.isColliding() && this.isAlive) {
      this.move();
    }

    this.draw();
    super.update();
  }
}

export default Player;
