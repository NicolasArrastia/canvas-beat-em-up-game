export const FPS = 30;
export const SPRITE_SIZE = 32;
export const TILE_SIZE = 16;

export const IDS = {
  PLAYER: "player",
  ENEMY: "enemy",
};

export const KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  W: 87,
  D: 68,
  S: 83,
  ENTER: 13,
};

export const CONTROLLERS = {
  PLAYER_1: {
    LEFT: [KEY_CODES.LEFT, KEY_CODES.A],
    UP: [KEY_CODES.UP, KEY_CODES.W],
    RIGHT: [KEY_CODES.RIGHT, KEY_CODES.D],
    DOWN: [KEY_CODES.DOWN, KEY_CODES.S],
  },
};

export const TILE_ID = {
  GROUND: 0,
  WALL: 1,
  DOOR: 2,
  COLUMN: 3,
  ENEMY: 5,
};

// - Leyend -
// 0: stone floor
// 1: wall
// 2: door
// 3: column
// 4: player
// 5: enemy

const LEVELS = [
  [
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 5, 0, 3, 0, 5, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 0, 0, 3, 0, 0, 3, 0, 1],
    [1, 0, 5, 0, 0, 0, 0, 0, 5, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 0, 0, 3, 0, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 5, 0, 0, 1, 0, 1, 0, 0, 5, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

// export const MAP = LEVELS[Math.floor(Math.random() * LEVELS.length)];

export function changeRandomLevel() {
  currentMap = LEVELS[Math.floor(Math.random() * LEVELS.length)];
}
export let currentMap = LEVELS[Math.floor(Math.random() * LEVELS.length)];

export const DUNGEON = [];

export const DEBUG = {
  SHOW_HIT: false,
  SHOW_HITBOX: false,
  SHOW_COLLISION: false,
  SHOW_HURTBOX: false,
  SHOW_LIFE_BAR: false,
  SHOW_SOLIDS: false,
  SHOW_LABELS: false,
};
