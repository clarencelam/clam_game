export default class EndDayPopup {
  // Class to represent the popup at the end of a level
  constructor(box_x, box_y, numFed, numCoins, tax) {
    this.x_pos = box_x;
    this.y_pos = box_y;
    this.height = 180;
    this.width = 350;
    this.box_title = "BUSINESS DAY OVER";
    this.numFed = numFed;
    this.numCoins = numCoins;
    this.tax = tax;

    this.screen_centered_x = this.x_pos / 2 - this.width / 2;
    this.screen_centered_y = this.y_pos / 2 - this.height / 2;

    this.box_background_color = "#B3EFF7";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";
  }

  update() {}

  draw(ctx) {
    // draw box to put info in
    ctx.fillStyle = this.box_background_color;
    ctx.textAlign = "left";
    ctx.font = "25px Tahoma";

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
      "Customers Fed: " + this.numFed,
      this.screen_centered_x + 10,
      this.screen_centered_y + 60
    );
    ctx.fillText(
      "Dollars Earned: " + this.numCoins,
      this.screen_centered_x + 10,
      this.screen_centered_y + 90
    );
    ctx.fillText(
      "Clean up the Kitchen's Food, & then press SPACEBAR to end the business day.",
      this.screen_centered_x + 10,
      this.screen_centered_y + 150
    );
  }
}
