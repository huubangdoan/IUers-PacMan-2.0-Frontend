function drawBackground(ctx, e, size, sprites) {
  ctx.drawImage(sprites['other/Background.webp'], 0, 0, e.cols * size, e.rows * size);
}

function drawWall(ctx, e, size, sprites) {
   ctx.drawImage(sprites['Menu Graphics/gachmap1.webp'], e.col * size, e.row * size, size, size);
}

function drawLightpoint(ctx, e, size, sprites) {
  ctx.drawImage(sprites['other/dot.webp'], e.col * size, e.row * size, size, size);
}

function drawGhost(ctx, e, size, sprites) {
  ctx.drawImage(sprites[`ghosts/${e.ghostType}.webp`], e.col * size, e.row * size, size, size);
}

function drawPacman(ctx, e, size, sprites) {
  ctx.drawImage(sprites[`${e.direction}/${e.frame}.webp`], e.col * size, e.row * size, size, size);
}
export const DRAWERS = {
  background: drawBackground,
  wall: drawWall,
  lightpoint: drawLightpoint,
  ghost: drawGhost,
  pacman: drawPacman,
};