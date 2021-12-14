export default class GameStats {
  constructor() {
    this.dollars = 0;
    this.level = 1;
  }
  update() {}
  draw(ctx) {
    ctx.font = "20px Georgia";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);
  }
}
