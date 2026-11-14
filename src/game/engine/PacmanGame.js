import { loadSprites } from '../assets/sprites';
import { validateGameMode } from '../contracts/GameMode';
import { validateMapDefinition } from '../contracts/MapDefinition';
import { DEFAULT_GAME_MODE, getGameMode } from '../data/modes';
import { getMapDefinition } from '../data/maps';
import EntityFactory from './EntityFactory';
import FeatureManager from '../features/FeatureManager';
import GameRenderer from '../rendering/GameRenderer';
import GameSocket from './GameSocket';
import GameStateMachine from './GameStateMachine';
import KeyboardController from './KeyboardController';
import { getNeighbor, isOpenTile } from './directions';

export default class PacmanGame {
  constructor(canvas, {
    tileSize = 32,
    socketUrl,
    mapDefinition,
    gameMode = DEFAULT_GAME_MODE,
    onConnection,
    onConnected,
    onScore,
    onBestScore,
    onMessage,
    onSaved,
    onSaveFailed,
  }) {
    const requestedMode = validateGameMode(typeof gameMode === 'string' ? getGameMode(gameMode) : gameMode);
    this.gameMode = getGameMode(requestedMode.id);
    if (JSON.stringify(requestedMode) !== JSON.stringify(this.gameMode)) {
      throw new Error(`Game mode "${requestedMode.id}" must match the registered server mode.`);
    }
    const registeredMap = getMapDefinition(this.gameMode.mapId);
    const requestedMap = validateMapDefinition(mapDefinition ?? registeredMap);
    if (JSON.stringify(requestedMap) !== JSON.stringify(registeredMap)) {
      throw new Error(`Map "${requestedMap.id}" must match the registered server map.`);
    }
    this.mapDefinition = registeredMap;
    this.map = this.mapDefinition.grid;
    this.features = new FeatureManager(this.mapDefinition, this.gameMode);
    this.renderer = new GameRenderer(canvas, this.map, tileSize);
    this.entityFactory = new EntityFactory({ randomGhostMoveChance: this.gameMode.rules.randomGhostMoveChance });
    this.player = this.entityFactory.createPlayer(this.mapDefinition.spawns.player);
    this.ghosts = this.entityFactory.createGhosts(this.mapDefinition.spawns.ghosts);
    this.socket = new GameSocket(socketUrl);
    this.stateMachine = new GameStateMachine();
    this.onConnection = onConnection;
    this.onConnected = onConnected;
    this.onScore = onScore;
    this.onBestScore = onBestScore;
    this.onMessage = onMessage;
    this.onSaved = onSaved;
    this.onSaveFailed = onSaveFailed;
    this.collected = new Set();
    this.score = 0;
    this.sequence = 0;
    this.lastAcknowledgedSequence = 0;
    this.disposed = false;
    this.sprites = null;
    this.lastFrameTime = 0;
    this.animationFrame = null;
    this.keyboard = new KeyboardController((command) => (
      this.stateMachine.handleCommand(this, command)
    ));
    this.handleSocketMessage = this.handleSocketMessage.bind(this);
    this.unsubscribers = [];
  }

  async start() {
    this.keyboard.start();
    this.unsubscribers = [
      this.socket.on('message', this.handleSocketMessage),
      this.socket.on('error', (error) => {
        this.stateMachine.handleMessage(this, { type: 'ERROR', message: error.message });
      }),
      this.socket.on('close', () => this.stateMachine.handleClose(this)),
    ];

    try {
      this.sprites = await loadSprites();
      if (this.disposed) return;
      this.renderer.initialize(this.sprites, this.collected, {
        dotsEnabled: this.features.hasEnabled('dots'),
      });
      this.features.initialize(this);
      this.connect();
      this.frame = this.frame.bind(this);
      this.animationFrame = window.requestAnimationFrame(this.frame);
    } catch (error) {
      console.error('Không tải được sprite game:', error);
      this.setConnection('Không tải được hình ảnh game.');
    }
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setConnection('Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại.');
      return;
    }
    this.socket.connect(token, { mapId: this.mapDefinition.id, modeId: this.gameMode.id });
  }

  queueMove(direction) {
    this.player.queueDirection(direction);
    if (!this.player.movement) this.startNextPlayerMove();
  }

  startNextPlayerMove(continueCurrent = false) {
    if (this.stateMachine.state.name !== 'playing' || this.player.movement) return false;

    const buffered = this.player.takePendingDirection();
    if (buffered && this.tryStartPlayerMove(buffered)) return true;
    if (!continueCurrent) return false;

    const currentDirection = this.getDirectionByName(this.player.direction);
    return currentDirection ? this.tryStartPlayerMove(currentDirection) : false;
  }

  tryStartPlayerMove(direction) {
    const target = getNeighbor(this.player.getCell(), direction);
    if (!isOpenTile(this.map, target.row, target.col)) return false;

    this.player.beginMove(direction, target);
    this.sequence += 1;
    this.socket.sendMove({
      sequence: this.sequence,
      direction: direction.name,
      row: target.row,
      col: target.col,
    });
    return true;
  }

  getDirectionByName(name) {
    const row = name === 'up' ? -1 : name === 'down' ? 1 : 0;
    const col = name === 'left' ? -1 : name === 'right' ? 1 : 0;
    return { row, col, name };
  }

  frame(timestamp) {
    if (this.disposed || !this.sprites) return;
    const deltaSeconds = this.lastFrameTime
      ? Math.min((timestamp - this.lastFrameTime) / 1000, 0.05)
      : 0;
    this.lastFrameTime = timestamp;
    this.stateMachine.update(this, deltaSeconds);
    this.features.update(this, deltaSeconds);

    this.renderer.draw({
      sprites: this.sprites,
      pacman: this.player,
      ghosts: this.ghosts,
      timestamp,
    });
    this.animationFrame = window.requestAnimationFrame(this.frame);
  }

  advancePlayer(deltaSeconds) {
    if (!this.player.movement) this.startNextPlayerMove();
    if (!this.player.movement || !this.player.advance(deltaSeconds)) return;

    this.features.onPlayerEnterCell(this, this.player.getCell());
    this.startNextPlayerMove(true);
  }

  updateGhosts(deltaSeconds) {
    this.ghosts.forEach((ghost) => ghost.update(deltaSeconds, this.map, this.player.getCell()));
  }

  handleSocketMessage(message) {
    this.stateMachine.handleMessage(this, message);
  }

  acceptReady(message) {
    this.player.correctPosition(message.row, message.col);
    this.syncCollected(message.collected);
    this.sequence = message.sequence || 0;
    this.lastAcknowledgedSequence = this.sequence;
    this.score = message.score || 0;
    this.onScore?.(this.score);
    this.onBestScore?.(message.bestScore ?? null);
    this.onConnected?.(true);
    this.setConnection('Đã kết nối');
  }

  acceptState(message) {
    if (Number.isInteger(message.sequence) && message.sequence > this.lastAcknowledgedSequence) {
      this.lastAcknowledgedSequence = message.sequence;
      if (!message.accepted) {
        this.player.correctPosition(message.row, message.col);
        this.syncCollected(message.collected);
      }
    }
    if (Number.isFinite(message.score)) {
      this.score = message.score;
      this.onScore?.(this.score);
    }
  }

  acceptFinished(message) {
    this.score = message.score || 0;
    this.onScore?.(this.score);
    this.onBestScore?.(message.bestScore ?? null);
    this.onMessage?.('Đã lưu điểm cho tài khoản của bạn.');
    this.onConnected?.(false);
    this.setConnection('Đã kết thúc ván');
    this.onSaved?.();
  }

  showServerError(message) {
    this.onConnected?.(false);
    this.setConnection(message.message || 'Máy chủ từ chối thao tác.');
  }

  failSave(message) {
    if (message) this.setConnection(message);
    this.onSaveFailed?.();
  }

  setConnection(message) {
    this.onConnection?.(message);
  }

  syncCollected(cells) {
    if (Array.isArray(cells)) {
      this.collected = new Set(cells);
      this.renderer.syncCollected(this.collected);
    }
  }

  requestFinish() {
    this.onMessage?.('Đang lưu điểm…');
    this.socket.finish();
  }

  finish() {
    this.stateMachine.finish(this);
  }

  stop() {
    this.disposed = true;
    this.keyboard.stop();
    if (this.animationFrame !== null) window.cancelAnimationFrame(this.animationFrame);
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.socket.close();
  }
}
