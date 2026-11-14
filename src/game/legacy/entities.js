import { LAYER } from '../data/constants';

class Entity{
    constructor(type, layer, row, col) {
         this.type = type;
         this.layer = layer;
         this.row = row;
         this.col = col;
    }
}
class MovingEntity extends Entity {
  constructor(type, layer, row, col, direction, speed) {
    super(type, layer, row, col);
    this.direction = direction; // 'up' | 'down' | 'left' | 'right'
    this.speed = speed;         // số ô đi được mỗi giây
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
     this.points = 10;       // điểm khi ăn
    this.eaten = false;     // state: đã bị ăn chưa
  }
}
export class Fruit extends Entity {
  constructor(row, col, fruitType = 'cherry') {
    super('fruit', LAYER.FRUIT, row, col);
    this.fruitType = fruitType;
    this.points = 100;
    this.eaten = false;
  }
}
export class Ghost extends MovingEntity {
  constructor(row, col, ghostType) {
    super('ghost', LAYER.GHOST, row, col, 'left', 4);
    this.ghostType = ghostType;
    this.state = 'normal';  // 'normal' | 'frightened' | 'eaten'
  }
}

export class Pacman extends MovingEntity {
  constructor(row, col) {
    super('pacman', LAYER.PACMAN, row, col, 'right', 5);
    this.frame = 1;
    this.state = 'alive';   // 'alive' | 'dead'
    this.lives = 3;
    this.score = 0;
  }
}
