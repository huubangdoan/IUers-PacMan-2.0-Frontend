import PriorityQueue from '../utils/PriorityQueue';
import { Background, Ghost, Lightpoint, Pacman, Wall } from './entities';
import './game/testEntities.js';

const q = new PriorityQueue();

// Cố tình bỏ vào theo thứ tự LỘN XỘN
const list = [
  new Pacman(9, 9),
  new Wall(0, 0),
  new Ghost(7, 8, 'red'),
  new Lightpoint(1, 1),
  new Background(15, 19),
];

list.forEach((e) => q.enqueue(e, e.layer));

while (!q.isEmpty()) {
  console.log(q.dequeue().type);
}