export default class Kitchen {
  // Class to represent the food objects used as bullets in the game
  constructor(gameWidth, gameHeight) {
    this.image = document.getElementById("truck_img");
    this.food_img1 = document.getElementById("nigiri_img");
    this.game_height = gameHeight;

    this.truck_width = 500;
    this.truck_height = 300;

    this.x_pos = 1;
    this.y_pos = gameHeight - this.truck_height;

    this.max_food = 10;
    this.cooked_food = [];

    this.size = 500;
    this.cooked_food_size = 50;

    this.number_pos_x = 40;
    this.number_pos_y = gameHeight * (2 / 3);

    this.cooking = false;
    this.cook_time = 1000;
  }

  update(deltaTime) {
    this.cooked_food = this.cooked_food.filter(
      (bullet) => !bullet.marked_for_deletion
    );

    this.cooked_food.forEach((food, index) => {
      food.update();
    });
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
      "KITCHEN - ORDERS READY:" + this.cooked_food.length,
      this.number_pos_x,
      this.number_pos_y
    );

    this.cooked_food.forEach((food, index) => {
      food.draw(ctx);
    });
  }
}
