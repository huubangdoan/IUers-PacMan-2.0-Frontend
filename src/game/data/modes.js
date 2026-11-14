import { validateGameMode } from '../contracts/GameMode';

export const GAME_MODES = Object.freeze({
  classic: validateGameMode({
    id: 'classic',
    name: 'Classic',
    mapId: 'classic',
    enabledFeatures: ['dots'],
    rules: { pointsPerDot: 10, randomGhostMoveChance: 0.7 },
  }),
  compact: validateGameMode({
    id: 'compact',
    name: 'Compact Maze',
    mapId: 'compact',
    enabledFeatures: ['dots', 'playerSpeed'],
    rules: { pointsPerDot: 10, randomGhostMoveChance: 0.4 },
  }),
});

export const DEFAULT_GAME_MODE = GAME_MODES.classic;

export function getGameMode(modeId) {
  const mode = GAME_MODES[modeId];
  if (!mode) throw new Error(`Unknown game mode "${modeId}".`);
  return mode;
}
