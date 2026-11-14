export default class PlayerSpeedFeature {
  constructor({ multiplier = 1.25 } = {}) {
    this.multiplier = multiplier;
  }

  initialize(game) {
    game.player.speed *= this.multiplier;
  }

  update() {}

  onPlayerEnterCell() {}
}
