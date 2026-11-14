export default class MoveCommand {
  constructor(direction) {
    this.direction = direction;
  }

  execute(game) {
    game.queueMove(this.direction);
  }
}
