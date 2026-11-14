/** @typedef {{ row: number, col: number }} Cell */

/**
 * A rectangular map definition consumed by the game engine.
 * `grid` uses 1 for walls and 0 for walkable cells.
 * @typedef {Object} MapDefinition
 * @property {string} id
 * @property {string} name
 * @property {number[][]} grid
 * @property {{ player: Cell, ghosts: Array<Cell & { type: string }> }} spawns
 * @property {Record<string, Object>} features
 */

/**
 * @param {MapDefinition} map
 * @returns {MapDefinition}
 */
export function validateMapDefinition(map) {
  if (!map?.id || !Array.isArray(map.grid) || map.grid.length === 0) {
    throw new Error('Map requires an id and a non-empty grid.');
  }

  const width = map.grid[0]?.length;
  if (!width || map.grid.some((row) => !Array.isArray(row) || row.length !== width)) {
    throw new Error(`Map "${map.id}" grid must be rectangular.`);
  }
  if (map.grid.some((row) => row.some((tile) => tile !== 0 && tile !== 1))) {
    throw new Error(`Map "${map.id}" grid cells must be 0 (floor) or 1 (wall).`);
  }

  const isWalkable = ({ row, col }) => (
    Number.isInteger(row) && Number.isInteger(col) && map.grid[row]?.[col] === 0
  );
  if (!map.spawns || !isWalkable(map.spawns.player)) {
    throw new Error(`Map "${map.id}" player spawn must be a walkable cell.`);
  }
  if (!Array.isArray(map.spawns.ghosts) || map.spawns.ghosts.some(
    (spawn) => !spawn.type || !isWalkable(spawn),
  )) {
    throw new Error(`Map "${map.id}" ghost spawns must have a type and be walkable cells.`);
  }
  if (!map.features || typeof map.features !== 'object' || Array.isArray(map.features)) {
    throw new Error(`Map "${map.id}" features must be a feature configuration object.`);
  }

  return map;
}
