export default class GameStats {
  constructor() {
    this.show_lvlstart_window = true;
    this.triggered_lvlstart_window = false;
    this.game_active = true;
    this.business_day_active = false;

    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.business_day_timer = 15;

    this.advance_interval = 500; //one second = two minute passes in timer

    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.days_tax = 10;
  }

  resetDailyStats() {
    this.days_dollars = 0;
    this.days_fedcusts = 0;
  }

  update() {}
  draw(ctx) {
    ctx.font = "20px Tahoma";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);

    ctx.fillText("DAYTIME LEFT: " + this.business_day_timer, 10, 40);
  }
}
