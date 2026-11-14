import MovingEntity from './MovingEntity';

export default class Ghost extends MovingEntity {
  constructor(spawn, strategy, speed = 2.1 + Math.random() * 0.7) {
    super(spawn, speed, 'left');
    this.type = spawn.type;
    this.strategy = strategy;
  }

  update(deltaSeconds, map, player) {
    if (!this.movement) {
      const choice = this.strategy.choose(this, player, map);
      if (!choice) return;
      this.beginMove(choice.direction, choice.target);
    }
    this.advance(deltaSeconds);
  }
}
