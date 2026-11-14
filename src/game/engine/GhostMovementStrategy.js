import {
  CARDINAL_DIRECTIONS,
  getNeighbor,
  isOpenTile,
  OPPOSITE_DIRECTION,
} from './directions';

class GhostStrategy {
  getOpenMoves(ghost, map) {
    return CARDINAL_DIRECTIONS
      .map((direction) => ({ direction, target: getNeighbor(ghost, direction) }))
      .filter(({ target }) => isOpenTile(map, target.row, target.col));
  }

  pick(moves) {
    return moves[Math.floor(Math.random() * moves.length)] ?? null;
  }
}

export class RandomMoveStrategy extends GhostStrategy {
  choose(ghost, _player, map) {
    const moves = this.getOpenMoves(ghost, map);
    const forwardMoves = moves.filter(
      ({ direction }) => direction.name !== OPPOSITE_DIRECTION[ghost.direction],
    );
    return this.pick(forwardMoves.length ? forwardMoves : moves);
  }
}

export class GreedyChaseStrategy extends GhostStrategy {
  choose(ghost, player, map) {
    const moves = this.getOpenMoves(ghost, map);
    if (!moves.length) return null;

    const distance = ({ target }) => (
      Math.abs(target.row - player.row) + Math.abs(target.col - player.col)
    );
    const closestDistance = Math.min(...moves.map(distance));
    return this.pick(moves.filter((move) => distance(move) === closestDistance));
  }
}

export class WeightedGhostStrategy {
  constructor({ random = new RandomMoveStrategy(), chase = new GreedyChaseStrategy(), randomChance = 0.7 } = {}) {
    this.random = random;
    this.chase = chase;
    this.randomChance = randomChance;
  }

  choose(ghost, player, map) {
    const strategy = Math.random() < this.randomChance ? this.random : this.chase;
    return strategy.choose(ghost, player, map);
  }
}
