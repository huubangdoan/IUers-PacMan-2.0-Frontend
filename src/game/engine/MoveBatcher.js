// Gom các bước đi vào hàng đợi, cứ mỗi intervalMs thì gửi một lần
export default class MoveBatcher {
  constructor(send, intervalMs = 150) {
    this.send = send;               // hàm gửi tin đi (do GameSocket đưa vào)
    this.intervalMs = intervalMs;   // chu kỳ gửi: 150ms
    this.buffer = [];               // hàng đợi các bước đi chưa gửi
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.flush(), this.intervalMs);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.buffer = [];
  }

  // Thêm một bước đi vào cuối hàng đợi
  add(move) {
    this.buffer.push(move);
  }

  // Lấy toàn bộ hàng đợi ra và gửi một lần. Trống thì không gửi.
  flush() {
    if (this.buffer.length === 0) return;
    const moves = this.buffer;
    this.buffer = [];
    this.send({ type: 'MOVE_BATCH', sentAt: Date.now(), moves });
  }
}