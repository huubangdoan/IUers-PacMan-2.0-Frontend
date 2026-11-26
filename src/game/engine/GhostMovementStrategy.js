import Queue from '../../utils/Queue';
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
export class BfsChaseStrategy extends GhostStrategy {
  choose(ghost, player, map) {
    const keyOf = (cell) => `${cell.row}:${cell.col}`;
    const start = { row: ghost.row, col: ghost.col };

    const queue = new Queue();
    const visited = new Set([keyOf(start)]);   // các ô đã ghé qua
    const firstStep = new Map();               // ô -> bước ĐẦU TIÊN để tới được ô đó

    queue.enqueue(start);
    while (!queue.isEmpty()) {
      const cell = queue.dequeue();

      // Tới Pac-Man rồi: trả về bước đầu tiên của con đường
      if (cell.row === player.row && cell.col === player.col) {
        return firstStep.get(keyOf(cell)) ?? null;
      }

      CARDINAL_DIRECTIONS.forEach((direction) => {
        const target = getNeighbor(cell, direction);
        const key = keyOf(target);
        if (visited.has(key) || !isOpenTile(map, target.row, target.col)) return;

        visited.add(key);
        // Nếu cell là ô xuất phát thì bước đầu là hướng này,
        // còn không thì thừa hưởng bước đầu của ô cha
        firstStep.set(key, firstStep.get(keyOf(cell)) ?? { direction, target });
        queue.enqueue(target);
      });
    }
    return null;   // không có đường tới Pac-Man
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
