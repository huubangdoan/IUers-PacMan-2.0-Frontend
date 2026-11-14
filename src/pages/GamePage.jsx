import GameCanvas from '../components/game/GameCanvas';

function GamePage({ onBack }) {
  return (
    <main className="game-page">
      <GameCanvas tileSize={32} onBack={onBack} />
    </main>
  );
}

export default GamePage;
