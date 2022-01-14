const UPGRADETYPES = {
  MARKETING: 0, // increase customer spawn
  LOGICSTICS: 1 //increase food cook time
};

export default class UpgradeObject {
  // Class to represent the popup at the end of a level
  constructor(x, y, type, gamestats, kitchen) {
    this.x_pos = x;
    this.y_pos = y;
    this.height = 200;
    this.width = 100;
    this.type = type;
    this.gamestats = gamestats;
    this.kitchen = kitchen;
    this.stat_level = 1;
  }

  upgrade() {
    switch (this.type) {
      case 0:
        // gamestats make spawn faster
        break;

      case 1:
        // make food cook faster
        this.kitchen.cook_time = this.kitchen.cook_time - 100;
        this.gamestats.dollars = this.gamestats.dollars - 1;
        this.stat_level = this.stat_level + 1;
        break;

      default:
        break;
    }
  }

  draw(ctx) {
    switch (this.type) {
      case 1:
        this.message1 = "RESEARCH LOGISTICS";
        this.message2 = "CURENT LEVEL: " + this.stat_level;
        break;

      default:
        break;
    }

    // draw box to put info in
    /**
     * ctx.fillStyle = this.box_background_color;
    ctx.fillRect(
      this.x_pos,
      this.y_pos,
      this.width,
      this.height
    );
    ctx.stroke();

     */

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(this.x_pos, this.y_pos, this.width, this.height);
    ctx.font = this.default_font;

    // write tax message
    ctx.fillText(this.message1, this.x_pos + 10, this.y_pos + 30);
    ctx.fillText(this.message2, this.x_pos + 10, this.y_pos + 60);
  }
}
