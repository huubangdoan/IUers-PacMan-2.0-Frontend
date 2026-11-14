import DotFeature from './DotFeature';
import PlayerSpeedFeature from './PlayerSpeedFeature';

const FEATURE_FACTORIES = {
  dots: (config) => new DotFeature(config),
  playerSpeed: (config) => new PlayerSpeedFeature(config),
};

export default class FeatureManager {
  constructor(mapDefinition, gameMode) {
    this.enabledIds = new Set(gameMode.enabledFeatures);
    this.features = gameMode.enabledFeatures.map((id) => {
      const factory = FEATURE_FACTORIES[id];
      if (!factory) throw new Error(`Unknown game feature "${id}".`);
      const options = id === 'dots' ? { points: gameMode.rules.pointsPerDot } : {};
      return factory({ ...mapDefinition.features[id], ...options, ...gameMode.featureOptions?.[id] });
    });
  }

  initialize(game) {
    this.features.forEach((feature) => feature.initialize(game));
  }

  update(game, deltaSeconds) {
    this.features.forEach((feature) => feature.update(game, deltaSeconds));
  }

  onPlayerEnterCell(game, cell) {
    this.features.forEach((feature) => feature.onPlayerEnterCell(game, cell));
  }

  hasEnabled(id) {
    return this.enabledIds.has(id);
  }
}
