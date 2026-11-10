
export function buildRenderQueue(map) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      console.log(row, col, map[row][col]);
    }
  }
}