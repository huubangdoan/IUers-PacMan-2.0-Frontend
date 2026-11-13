import { useEffect, useRef } from 'react';
import { buildRenderQueue } from '../game/buildRenderQueue';
import { DRAWERS } from '../game/drawers';
import { MAP_1, SPAWNS } from '../game/map1';
import { loadSprites } from '../game/sprites';
function GameCanvas({ tileSize = 32 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = MAP_1[0].length * tileSize;
    canvas.height = MAP_1.length * tileSize;
  
     loadSprites().then((sprites) => {
  const queue = buildRenderQueue(MAP_1, SPAWNS);
  while (!queue.isEmpty()) {
    const entity = queue.dequeue();
    DRAWERS[entity.type](ctx, entity, tileSize, sprites);
  }
});


  }, [tileSize]);

  return <canvas ref={canvasRef} />;
}

export default GameCanvas;