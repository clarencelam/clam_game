export default class Kitchen {
  // Class to represent the food objects used as bullets in the game
  constructor(gameHeight, gameWidth) {
    this.image = document.getElementById("truck_img");
    this.food_img1 = document.getElementById("nigiri_img");
    this.game_height = gameHeight;

    this.truck_width = 500;
    this.truck_height = 300;
    this.x_pos = 1;
    this.y_pos = gameHeight - this.truck_height;
    this.size = 500;
    this.cooked_food_size = 50;
    this.max_food = 10;

    this.number_pos_x = 40;
    this.number_pos_y = gameHeight * (2 / 3);
    this.cooking = false;
    this.cooked_food = 0;
    this.cook_time = 500;
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
      "KITCHEN - ORDERS READY:" + this.cooked_food,
      this.number_pos_x,
      this.number_pos_y
    );
    ctx.rect(this.x_pos, this.y_pos, this.size, this.size);
    ctx.stroke();

    for (let i = 0; i < this.cooked_food; i += 1) {
      ctx.drawImage(
        this.food_img1,
        i * this.cooked_food_size,
        this.game_height - this.cooked_food_size,
        this.cooked_food_size,
        this.cooked_food_size
      );
    }
  }
}
