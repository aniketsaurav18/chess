class Queue<T> {
  private getter: ((value: T) => void) | null;
  private list: T[];

  constructor() {
    this.getter = null;
    this.list = [];
  }

  async get(): Promise<T> {
    if (this.list.length > 0) {
      return this.list.shift() as T;
    }
    return await new Promise<T>((resolve) => (this.getter = resolve));
  }

  put(x: T): void {
    if (this.getter) {
      this.getter(x);
      this.getter = null;
    } else {
      this.list.push(x);
    }
  }
}

export default Queue;
