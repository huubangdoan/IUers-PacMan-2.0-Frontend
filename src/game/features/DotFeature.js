/**
 * @typedef {Object} GameFeature
 * @property {(game: Object) => void} initialize
 * @property {(game: Object, deltaSeconds: number) => void} update
 * @property {(game: Object, cell: {row: number, col: number}) => void} onPlayerEnterCell
 */

export default class DotFeature {
  constructor({ points = 10 } = {}) {
    this.points = points;
  }

  initialize() {}

  update() {}

  onPlayerEnterCell(game, cell) {
    const key = `${cell.row}:${cell.col}`;
    if (game.collected.has(key)) return;

    game.collected.add(key);
    game.renderer.collect(cell.row, cell.col);
    game.score += this.points;
    game.onScore?.(game.score);
  }
}
