import MovingEntity from './MovingEntity';

export default class PacmanPlayer extends MovingEntity {
  constructor(spawn, speed = 5) {
    super(spawn, speed, 'left');
    this.pendingDirection = null;
  }

  queueDirection(direction) {
    this.pendingDirection = direction;
  }

  takePendingDirection() {
    const direction = this.pendingDirection;
    this.pendingDirection = null;
    return direction;
  }

  correctPosition(row, col) {
    this.row = row;
    this.col = col;
    this.pendingDirection = null;
    this.movement = null;
  }
}
