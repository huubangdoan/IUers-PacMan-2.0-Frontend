// Queue: vào trước, ra trước (FIFO)
export default class Queue {
  constructor() {
    this.items = [];
    this.head = 0;          // vị trí của phần tử đầu hàng
  }

  get size() { return this.items.length - this.head; }
  isEmpty() { return this.size === 0; }

  // Thêm vào cuối hàng
  enqueue(item) {
    this.items.push(item);
  }

  // Lấy phần tử đầu hàng ra
  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.items[this.head];
    this.head += 1;
    return item;
  }
}