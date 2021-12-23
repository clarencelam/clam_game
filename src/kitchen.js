import Food from "/src/food";

import { detectCollision, randomIntFromInterval } from "/src/gameMechanics";

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

    this.max_food = 10;
    this.cooked_food = [];
    if (this.cooked_food === true) {
      this.cooked_food_length = this.cooked_food.length;
    } else {
      this.cooked_food_length = 0;
    }

    this.size = 500;
    this.cooked_food_size = 50;

    this.number_pos_x = 40;
    this.number_pos_y = gameHeight * (2 / 3);

    this.cooking = false;
    this.cook_time = 2000;
  }

  update(deltaTime) {
    this.cooked_food = this.cooked_food.filter(
      (bullet) => !bullet.marked_for_deletion
    );

    this.cooked_food.forEach((food, index) => {
      food.update();
    });

    // intitialize cooking
    if (this.cooking === false) {
      var kitchenCooking = setInterval(cookFood, this.cook_time);
      this.cooking = true;
    }

    // cookfood interval function
    function cookFood() {
      // Cook a food bullet into the kitchen if space is available

      if (this.cooked_food_length < this.max_food) {
        // Generate random y point within food truck window
        this.rndBinary = randomIntFromInterval(
          this.y_pos + this.truck_height * (2 / 5), // top of truck window
          this.y_pos + this.truck_height * (3 / 5) - 5 // bottom of truck window
        );

        this.cooked_food.push(
          // push new food item to food truck
          new Food(this.x_pos + 30, this.rndBinary, 1, true, this.kitchen)
        );
      }

      // if this.cooking is false, then stop the kitchen cooking interval loop
      if (this.cooking === false) {
        clearInterval(kitchenCooking);
      }
    }
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
