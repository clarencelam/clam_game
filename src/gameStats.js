export default class GameStats {
  constructor() {
    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.start_hr = 9;
    this.start_min = 0;
    this.advance_interval = 500; //one second = two minute passes in timer
  }

  update() {}
  draw(ctx) {
    ctx.font = "20px Georgia";
    ctx.fillText("DOLLARS: " + this.dollars, 10, 20);

    // function to add leading 0 for minutes if minutes <10
    if (this.start_min < 10) {
      ctx.fillText("TIME: " + this.start_hr + ":00", 10, 40, 100);
    } else {
      ctx.fillText(
        "TIME: " + this.start_hr + ":" + this.start_min,
        10,
        40,
        100
      );
    }
  }
}
