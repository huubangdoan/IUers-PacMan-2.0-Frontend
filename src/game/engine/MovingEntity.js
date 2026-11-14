export default class MovingEntity {
  constructor(spawn, speed, direction = 'left') {
    this.row = spawn.row;
    this.col = spawn.col;
    this.speed = speed;
    this.direction = direction;
    this.movement = null;
  }

  getCell() {
    return { row: this.row, col: this.col };
  }

  getRenderPosition() {
    if (!this.movement) return this.getCell();
    const { from, to, progress } = this.movement;
    return {
      row: from.row + (to.row - from.row) * progress,
      col: from.col + (to.col - from.col) * progress,
    };
  }

  beginMove(direction, target) {
    this.direction = direction.name;
    this.movement = {
      from: this.getCell(),
      to: target,
      progress: 0,
    };
  }

  advance(deltaSeconds) {
    if (!this.movement) return false;
    this.movement.progress += deltaSeconds * this.speed;
    if (this.movement.progress < 1) return false;

    this.row = this.movement.to.row;
    this.col = this.movement.to.col;
    this.movement = null;
    return true;
  }
}
