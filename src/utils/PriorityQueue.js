// Min-heap: phần tử có priority NHỎ NHẤT luôn nằm ở đỉnh (index 0)
export default class PriorityQueue {
    constructor() {
        this.heap = [];     // mảng biểu diễn cây nhị phân
        this.counter = 0;   // số thứ tự chèn
    }

    get size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }

    // Thêm phần tử
    enqueue(item, priority) {
        this.heap.push({ item, priority, order: this.counter++ });
        this._siftUp(this.heap.length - 1);
    }

    // Lấy phần tử ưu tiên cao nhất (priority nhỏ nhất)
    dequeue() {
        if (this.isEmpty()) return null;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;   // đưa phần tử cuối lên đỉnh
            this._siftDown(0);     //
        }
        return top.item;
    }

    peek() { return this.isEmpty() ? null : this.heap[0].item; }

    // a đứng trước b? So priority trước, bằng nhau thì so thứ tự chèn
    _isBefore(a, b) {
        const A = this.heap[a], B = this.heap[b];
        if (A.priority !== B.priority) return A.priority < B.priority;
        return A.order < B.order;
    }

    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    _siftUp(i) {
        while (i > 0) {
            const parent = (i - 1) >> 1;          // cha của i
            if (!this._isBefore(i, parent)) break;
            this._swap(i, parent);
            i = parent;
        }
    }

    _siftDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1, right = 2 * i + 2;
            if (left < n && this._isBefore(left, smallest)) smallest = left;
            if (right < n && this._isBefore(right, smallest)) smallest = right;
            if (smallest === i) break;
            this._swap(i, smallest);
            i = smallest;
        }
    }
}