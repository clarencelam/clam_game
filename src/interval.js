export default class Interval {
  constructor(funct, interv) {
    this.fn = funct;
    this.repeatInterval = interv;
    this.handle = null;
  }

  get running() {
    return this.handle !== null;
  }

  run(...args) {
    if (!this.running) {
      this.handle = setInterval(this.fn, this.repeatInterval, ...args);
    } else {
      // optionally throw, display msg, whatever
    }
    return this;
  }

  stop() {
    clearInterval(this.handle);
    this.handle = null;
    return this;
  }
}
