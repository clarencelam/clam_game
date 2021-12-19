export default class EndDayPopup {
  // Class to represent the popup at the end of a level
  constructor(box_x, box_y, numFed, numCoins) {
    this.x_pos = box_x;
    this.y_pos = box_y;
    this.height = 120;
    this.width = 300;
    this.box_title = "BUSINESS DAY OVER";
    this.numFed = numFed;
    this.numCoins = numCoins;

    this.screen_centered_x = this.x_pos - this.width / 2;
    this.screen_centered_y = this.y_pos - this.height / 2;

    this.box_background_color = "#B3EFF7";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";
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
    ctx.rect(
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
  }
}