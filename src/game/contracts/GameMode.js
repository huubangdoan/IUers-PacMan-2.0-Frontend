/**
 * @typedef {Object} GameMode
 * @property {string} id
 * @property {string} name
 * @property {string} mapId
 * @property {string[]} enabledFeatures
 * @property {{ pointsPerDot: number, randomGhostMoveChance: number }} rules
 * @property {Record<string, Object>} [featureOptions]
 */

export function validateGameMode(mode) {
  if (!mode?.id || !mode.name || !mode.mapId || !Array.isArray(mode.enabledFeatures)) {
    throw new Error('Game mode requires an id, mapId, and enabledFeatures list.');
  }
  const { pointsPerDot, randomGhostMoveChance } = mode.rules ?? {};
  if (!Number.isFinite(pointsPerDot) || pointsPerDot < 0) {
    throw new Error(`Game mode "${mode.id}" must define a non-negative pointsPerDot.`);
  }
  if (!Number.isFinite(randomGhostMoveChance)
      || randomGhostMoveChance < 0 || randomGhostMoveChance > 1) {
    throw new Error(`Game mode "${mode.id}" randomGhostMoveChance must be between 0 and 1.`);
  }
  if (new Set(mode.enabledFeatures).size !== mode.enabledFeatures.length
      || mode.enabledFeatures.some((id) => typeof id !== 'string' || !id)) {
    throw new Error(`Game mode "${mode.id}" enabledFeatures must contain unique feature IDs.`);
  }
  return mode;
}
