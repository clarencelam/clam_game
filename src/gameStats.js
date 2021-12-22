export default class GameStats {
  constructor() {
    this.show_lvlstart_window = true;
    this.triggered_lvlstart_window = false;
    this.show_lvlend_window = false;
    this.game_active = true;
    this.business_day_active = false;
    this.night_time_active = false;

    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.business_day_timer = 15;

    this.advance_interval = 1000; //one second = two minute passes in timer

    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.days_tax = 2;
  }

  resetLevel() {
    // perform the reset of objects needed to go to another level
    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.timerOn = false;
    this.business_day_timer = 30;
  }

  incrementLevel() {
    // Increment objects to make the next level harder
    this.days_tax = this.days_tax + 1;
    this.day++;
  }

  update() {}
  draw(ctx) {
    ctx.font = "20px Tahoma";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);

    ctx.fillText("DAYTIME LEFT: " + this.business_day_timer, 10, 40);
  }
}
