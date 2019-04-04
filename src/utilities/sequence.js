class Sequence {
  constructor() {
    this.current = 0;
  }

  autoIncrement() {
    this.current += 1;
    return this.current;
  }

  reset() {
    this.current = 0;
  }
}

export default Sequence;
