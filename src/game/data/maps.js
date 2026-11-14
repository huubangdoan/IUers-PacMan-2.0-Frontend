import { validateMapDefinition } from '../contracts/MapDefinition';
import { COMPACT_MAP } from './compactMap';
import { CLASSIC_MAP } from './map1';

export const MAPS = Object.freeze({
  [CLASSIC_MAP.id]: validateMapDefinition(CLASSIC_MAP),
  [COMPACT_MAP.id]: COMPACT_MAP,
});

export function getMapDefinition(mapId) {
  const map = MAPS[mapId];
  if (!map) throw new Error(`Unknown map "${mapId}".`);
  return map;
}
