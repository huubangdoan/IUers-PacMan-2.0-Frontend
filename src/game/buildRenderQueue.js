import PriorityQueue from '../utils/PriorityQueue';
import { Background, Ghost, Lightpoint, Pacman, Wall } from './entities';


export function buildRenderQueue(grid, spawns) {
  const queue = new PriorityQueue();
  const rows = grid.length;
  const cols = grid[0].length;

  const bg = new Background(rows, cols);
  queue.enqueue(bg, bg.layer);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const entity = grid[row][col] === 1 ? new Wall(row, col) : new Lightpoint(row, col) ;
      queue.enqueue(entity, entity.layer);
    }
  }

     spawns.ghosts.forEach(({row, col, type}) => {
      const ghost = new Ghost(row, col, type);
      queue.enqueue(ghost, ghost.layer);
    });

    const pacman = new Pacman(spawns.pacman.row, spawns.pacman.col);
    queue.enqueue(pacman, pacman.layer);

  return queue;
}