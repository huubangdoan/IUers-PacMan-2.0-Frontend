import { validateMapDefinition } from '../contracts/MapDefinition';

export const COMPACT_MAP = validateMapDefinition({
  id: 'compact',
  name: 'Compact Maze',
  grid: [
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1],
  ],
  spawns: {
    player: { row: 4, col: 4 },
    ghosts: [
      { row: 1, col: 1, type: 'blinky' },
      { row: 1, col: 7, type: 'pinky' },
      { row: 6, col: 1, type: 'inky' },
      { row: 6, col: 7, type: 'clyde' },
    ],
  },
  features: {
    dots: { points: 10 },
    playerSpeed: { multiplier: 1.25 },
  },
});
