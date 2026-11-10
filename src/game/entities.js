import { LAYER } from './constants';

class Entity{
    constructor(type, layer, row, col) {
         this.type = type;
         this.layer = layer;
         this.row = row;
         this.col = col;
    }
}
export class Background extends Entity {
  constructor(rows, cols) {
    super('background', LAYER.BACKGROUND, 0, 0);
    this.rows = rows;
    this.cols = cols;
  }
}

export class Wall extends Entity {
  constructor(row, col) {
    super('wall', LAYER.WALL, row, col);
  }
}

export class Lightpoint extends Entity {
  constructor(row, col) {
    super('lightpoint', LAYER.LIGHTPOINT, row, col);
  }
}

export class Ghost extends Entity {
  constructor(row, col, color) {
    super('ghost', LAYER.GHOST, row, col);
    this.color = color;
  }
}

export class Pacman extends Entity {
  constructor(row, col) {
    super('pacman', LAYER.PACMAN, row, col);
  }
}