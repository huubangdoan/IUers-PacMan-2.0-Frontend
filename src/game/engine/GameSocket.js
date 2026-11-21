 import MoveBatcher from './MoveBatcher';
export default class GameSocket {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.listeners = new Map();
    this.batcher = new MoveBatcher((message) => this.send(message), 150);
  }

  on(eventName, listener) {
    const listeners = this.listeners.get(eventName) ?? new Set();
    listeners.add(listener);
    this.listeners.set(eventName, listeners);
    return () => listeners.delete(listener);
  }

  emit(eventName, value) {
    this.listeners.get(eventName)?.forEach((listener) => listener(value));
  }

  connect(token, { mapId = 'classic', modeId = 'classic' } = {}) {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'AUTH', token, mapId, modeId }));
    });
    this.socket.addEventListener('message', (event) => {
      try {
        this.emit('message', JSON.parse(event.data));
      } catch {
        this.emit('error', new Error('Máy chủ gửi dữ liệu không hợp lệ.'));
      }
    });
    this.socket.addEventListener('error', () => {
      this.emit('error', new Error('Không kết nối được backend game.'));
    });
    this.socket.addEventListener('close', () => {
      this.batcher.stop();
      this.emit('close');
    });
  }
// Không gửi ngay nữa, chỉ bỏ vào hàng đợi
  sendMove({ sequence, direction, row, col, timestamp }) {
    this.batcher.add({ sequence, direction, row, col, timestamp });
  }

  finish() {
    this.batcher.flush();// gửi nốt các bước còn trong hàng đợi trước khi kết thúc
    this.send({ type: 'FINISH' });
  }

  send(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  close() {
    this.batcher.stop();
    this.socket?.close();
    this.listeners.clear();
  }
}
