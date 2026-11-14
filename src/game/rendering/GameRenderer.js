export default class GameRenderer {
  constructor(canvas, map, tileSize) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.map = map;
    this.tileSize = tileSize;
    canvas.width = map[0].length * tileSize;
    canvas.height = map.length * tileSize;
    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCanvas.width = canvas.width;
    this.backgroundCanvas.height = canvas.height;
    this.backgroundContext = this.backgroundCanvas.getContext('2d');
    this.dotsCanvas = document.createElement('canvas');
    this.dotsCanvas.width = canvas.width;
    this.dotsCanvas.height = canvas.height;
    this.dotsContext = this.dotsCanvas.getContext('2d');
    this.initialized = false;
  }

  initialize(sprites, collected = new Set(), { dotsEnabled = true } = {}) {
    const { map, tileSize, backgroundContext } = this;
    const background = sprites['other/Background.webp'];
    if (background) {
      backgroundContext.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    }

    const wall = sprites['Menu Graphics/gachmap1.webp'];
    if (wall) {
      for (let row = 0; row < map.length; row += 1) {
        for (let col = 0; col < map[row].length; col += 1) {
          if (map[row][col] === 1) {
            backgroundContext.drawImage(wall, col * tileSize, row * tileSize, tileSize, tileSize);
          }
        }
      }
    }

    this.dotSprite = sprites['other/dot.webp'];
    this.dotsEnabled = dotsEnabled;
    this.initialized = true;
    this.syncCollected(collected);
  }

  syncCollected(collected) {
    if (!this.initialized) return;
    const { map, tileSize, dotsContext } = this;
    dotsContext.clearRect(0, 0, this.dotsCanvas.width, this.dotsCanvas.height);
    if (!this.dotSprite || !this.dotsEnabled) return;

    for (let row = 0; row < map.length; row += 1) {
      for (let col = 0; col < map[row].length; col += 1) {
        if (map[row][col] === 0 && !collected.has(`${row}:${col}`)) {
          dotsContext.drawImage(this.dotSprite, col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }
    }
  }

  collect(row, col) {
    if (!this.initialized) return;
    this.dotsContext.clearRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
  }

  draw({ sprites, pacman, ghosts, timestamp }) {
    const { context, canvas, tileSize } = this;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this.backgroundCanvas, 0, 0);
    context.drawImage(this.dotsCanvas, 0, 0);

    ghosts.forEach((ghost) => {
      const sprite = sprites[`ghosts/${ghost.type}.webp`];
      const position = ghost.getRenderPosition();
      if (sprite) {
        context.drawImage(sprite, position.col * tileSize, position.row * tileSize, tileSize, tileSize);
      }
    });

    const position = pacman.getRenderPosition();
    const frame = 1 + (Math.floor(timestamp / 120) % 3);
    const sprite = sprites[`${pacman.direction}/${frame}.webp`];
    if (sprite) {
      context.drawImage(sprite, position.col * tileSize, position.row * tileSize, tileSize, tileSize);
    }
  }
}
