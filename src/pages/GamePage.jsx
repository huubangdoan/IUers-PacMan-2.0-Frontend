import GameCanvas from '../components/GameCanvas';

function GamePage() {
  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="page-heading">Map 1</h1>
      <GameCanvas tileSize={32} />
    </div>
  );
}

export default GamePage;