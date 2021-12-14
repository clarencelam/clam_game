export default class Kitchen {
  // Class to represent the food objects used as bullets in the game
  constructor(gameHeight, gameWidth) {
    this.image = document.getElementById("truck_img");
    this.truck_width = 500;
    this.truck_height = 300;
    this.x_pos = 1;
    this.y_pos = gameHeight - this.truck_height;
    this.size = 500;

    this.number_pos_x = 40;
    this.number_pos_y = gameHeight * (2 / 3);
    this.cooking = false;
    this.cooked_food = 0;
    this.cook_time = 2000;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x_pos,
      this.y_pos,
      this.truck_width,
      this.truck_height
    );
    ctx.fillText(
      "ORDERS READY:" + this.cooked_food,
      this.number_pos_x,
      this.number_pos_y
    );
  }
}
