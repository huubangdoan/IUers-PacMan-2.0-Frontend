// Stack: vào sau, ra trước (LIFO)
export default class Stack {
  constructor() {
    this.items = [];   // mảng chứa các phần tử, phần tử cuối là đỉnh
  }

  get size() { return this.items.length; }
  isEmpty() { return this.items.length === 0; }

  // Đặt phần tử lên đỉnh
  push(item) {
    this.items.push(item);
  }

  // Lấy phần tử ở đỉnh ra (và xóa khỏi stack)
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  // Xem phần tử ở đỉnh nhưng không lấy ra
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
}