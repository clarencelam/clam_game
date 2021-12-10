export default class Kitchen {
  // Class to represent the food objects used as bullets in the game
  constructor(gameHeight, gameWidth) {
    this.number_pos_x = 10;
    this.number_pos_y = gameHeight * (2 / 3);
    this.cooking = false;
    this.cooked_food = 0;
  }

  draw(ctx) {
    ctx.fillText(
      "ORDERS READY:" + this.cooked_food,
      this.number_pos_x,
      this.number_pos_y
    );
  }
}
