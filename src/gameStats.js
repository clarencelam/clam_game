export default class GameStats {
  constructor() {
    this.game_active = true;
    this.business_day_active = true;

    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.business_day_timer = 5;

    this.advance_interval = 500; //one second = two minute passes in timer
  }

  update() {}
  draw(ctx) {
    ctx.font = "20px Georgia";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);

    ctx.fillText("DAYTIME LEFT: " + this.business_day_timer, 10, 40);
  }
}
