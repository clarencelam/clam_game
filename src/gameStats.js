export default class GameStats {
  constructor() {
    this.daysTaxPaid = false;

    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.business_day_timer = 5;

    this.advance_interval = 1000; //one second = two minute passes in timer

    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.days_tax = 2;
  }

  gameOver() {
    // perform reset of objects needed to reset game
    this.day = 1;
    this.dollars = 0;
    this.days_tax = 2;
  }

  resetLevel() {
    // perform the reset of objects needed to go to another level
    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.timerOn = false;
    this.business_day_timer = 10;
    this.daysTaxPaid = false;
  }

  incrementLevel() {
    // Increment objects to make the next level harder
    this.days_tax = this.days_tax + 1;
    this.day++;
  }

  update() {}
  draw(ctx) {
    ctx.textAlign = "left";
    ctx.font = "20px Tahoma";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);

    ctx.fillText("DAYTIME LEFT: " + this.business_day_timer, 10, 40);
  }
}
