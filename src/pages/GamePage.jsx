import GameCanvas from '../components/game/GameCanvas';
import { DEFAULT_GAME_MODE } from '../game/data/modes';

function GamePage({ onBack, mapDefinition, gameMode = DEFAULT_GAME_MODE }) {
  return (
    <div className="game-page">
      <GameCanvas tileSize={32} onBack={onBack} mapDefinition={mapDefinition} gameMode={gameMode} />
    </div>
  );
}

export default GamePage;
