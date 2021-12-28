export default class BeginDayPopup {
  // Class to represent the popup at the end of a level
  constructor(gamewidth, gameheight, daynumber, timerlength, taxamount) {
    this.gamewidth = gamewidth;
    this.gameheight = gameheight;
    this.height = 200;
    this.width = 800;
    this.day_number = daynumber;
    this.timer_length = timerlength;
    this.tax_amount = taxamount;

    this.screen_centered_x = this.gamewidth / 2 - this.width / 2;
    this.screen_centered_y = this.gameheight / 2 - this.height;

    this.box_background_color = "#B3EFF7";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";

    this.box_title = "DAY: " + this.day_number;
    this.box_line1 = "Today's work day is " + this.timer_length + " seconds.";
    this.box_line2 =
      "Collect food from your food truck and feed as many customers as you can";
    this.box_line3 = "Make sure you make enough money to pay the day's tax";
    this.box_line4 = "TAX OWED AT END OF DAY: " + this.tax_amount + " COINS";
    this.box_line5 = "Press SPACEBAR to begin work day";
  }

  update() {}

  draw(ctx) {
    // draw box to put info in
    ctx.fillStyle = this.box_background_color;
    ctx.fillRect(
      this.screen_centered_x,
      this.screen_centered_y,
      this.width,
      this.height
    );
    ctx.stroke();

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(
      this.screen_centered_x,
      this.screen_centered_y,
      this.width,
      this.height
    );

    ctx.font = this.default_font;
    ctx.fillText(
      this.box_title,
      this.screen_centered_x + 10,
      this.screen_centered_y + 30
    );
    ctx.font = this.default_font;
    ctx.fillText(
      this.box_line1,
      this.screen_centered_x + 10,
      this.screen_centered_y + 60
    );
    ctx.fillText(
      this.box_line2,
      this.screen_centered_x + 10,
      this.screen_centered_y + 90
    );
    ctx.fillText(
      this.box_line3,
      this.screen_centered_x + 10,
      this.screen_centered_y + 120
    );
    ctx.fillText(
      this.box_line4,
      this.screen_centered_x + 10,
      this.screen_centered_y + 150
    );
    ctx.fillText(
      this.box_line5,
      this.screen_centered_x + 450,
      this.screen_centered_y + 180
    );
  }
}
