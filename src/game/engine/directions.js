export const DIRECTIONS = {
  ArrowUp: { row: -1, col: 0, name: 'up' },
  w: { row: -1, col: 0, name: 'up' },
  W: { row: -1, col: 0, name: 'up' },
  ArrowDown: { row: 1, col: 0, name: 'down' },
  s: { row: 1, col: 0, name: 'down' },
  S: { row: 1, col: 0, name: 'down' },
  ArrowLeft: { row: 0, col: -1, name: 'left' },
  a: { row: 0, col: -1, name: 'left' },
  A: { row: 0, col: -1, name: 'left' },
  ArrowRight: { row: 0, col: 1, name: 'right' },
  d: { row: 0, col: 1, name: 'right' },
  D: { row: 0, col: 1, name: 'right' },
};

export const CARDINAL_DIRECTIONS = [
  DIRECTIONS.ArrowUp,
  DIRECTIONS.ArrowDown,
  DIRECTIONS.ArrowLeft,
  DIRECTIONS.ArrowRight,
];

export const OPPOSITE_DIRECTION = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const isOpenTile = (map, row, col) => map[row]?.[col] === 0;

export const getNeighbor = (cell, direction) => ({
  row: cell.row + direction.row,
  col: cell.col + direction.col,
});
