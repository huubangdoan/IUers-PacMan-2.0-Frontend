import { useEffect, useRef, useState } from 'react';
import PacmanGame from '../../game/engine/PacmanGame';
import { DEFAULT_GAME_MODE } from '../../game/data/modes';

function getWebSocketUrl() {
  if (import.meta.env.VITE_WS_BASE_URL) return import.meta.env.VITE_WS_BASE_URL;

  if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'wss://iuers-pacman-2-0-backend.onrender.com/ws/game';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/game`;
}

function GameCanvas({ tileSize = 32, onBack, mapDefinition, gameMode = DEFAULT_GAME_MODE }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const onBackRef = useRef(onBack);
  const pendingBackRef = useRef(false);
  const [connection, setConnection] = useState('Đang kết nối máy chủ…');
  const [isConnected, setIsConnected] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [gameMessage, setGameMessage] = useState('');

  onBackRef.current = onBack;

  const handleBack = () => {
    if (!isConnected) {
      onBackRef.current?.();
      return;
    }
    pendingBackRef.current = true;
    gameRef.current?.finish();
  };

  useEffect(() => {
    const game = new PacmanGame(canvasRef.current, {
      tileSize,
      socketUrl: getWebSocketUrl(),
      mapDefinition,
      gameMode,
      onConnection: setConnection,
      onConnected: setIsConnected,
      onScore: setScore,
      onBestScore: setBestScore,
      onMessage: setGameMessage,
      onSaved: () => {
        if (!pendingBackRef.current) return;
        pendingBackRef.current = false;
        onBackRef.current?.();
      },
      onSaveFailed: () => {
        pendingBackRef.current = false;
      },
    });
    gameRef.current = game;
    game.start();

    return () => {
      game.stop();
      gameRef.current = null;
    };
  }, [tileSize, mapDefinition, gameMode]);

  return (
    <section className="game-shell" aria-label="Trò chơi IUers Pacman">
      <div className="game-hud">
        <button type="button" className="game-back-button" onClick={handleBack}>← Trang chủ</button>
        <span>Điểm: <strong>{score}</strong></span>
        {bestScore !== null && <span>Điểm cao nhất: <strong>{bestScore}</strong></span>}
        <span className="game-connection">{connection}</span>
        <button type="button" disabled={!isConnected} onClick={() => gameRef.current?.finish()}>
          Kết thúc và lưu điểm
        </button>
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
      {gameMessage && <p className="game-message" role="status">{gameMessage}</p>}
    </section>
  );
}

export default GameCanvas;
