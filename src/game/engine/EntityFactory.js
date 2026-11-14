import Ghost from './Ghost';
import { GreedyChaseStrategy, RandomMoveStrategy, WeightedGhostStrategy } from './GhostMovementStrategy';
import PacmanPlayer from './PacmanPlayer';

export default class EntityFactory {
  constructor({ randomGhostMoveChance = 0.7 } = {}) {
    this.ghostStrategy = new WeightedGhostStrategy({
      random: new RandomMoveStrategy(),
      chase: new GreedyChaseStrategy(),
      randomChance: randomGhostMoveChance,
    });
  }

  createPlayer(spawn) {
    return new PacmanPlayer(spawn);
  }

  createGhost(spawn) {
    return new Ghost(spawn, this.ghostStrategy);
  }

  createGhosts(spawns) {
    return spawns.map((spawn) => this.createGhost(spawn));
  }
}
