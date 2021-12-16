import { randomIntFromInterval } from "/src/gameMechanics";

export default class Food {
  // Class to represent the food objects used as bullets in the game
  constructor(x, y, facing, kitchenFood = false, kitchen) {
    this.image = document.getElementById("nigiri_img");
    this.x_pos = x;
    this.y_pos = y;
    this.size = 50;
    this.init_speed = 10;
    this.speed_depricator = 0.2;
    this.fade_time = 180;
    this.fade_depricator = 1;
    this.marked_for_deletion = false;
    this.food_hit = false;
    this.hunger_fill = 1;
    this.pickupable = false;

    this.direction = facing; // 1 if right, -1 if left

    if (kitchenFood === true) {
      this.rnd_speed = randomIntFromInterval(2, 9);

      this.fade_depricator = 0;
      this.pickupable = true;
      this.init_speed = this.rnd_speed;
      console.log("spit new kitchen foood");
    }
  }

  hitCustomer(customer) {
    // actions when food hits customer
    // below if-block ensures the food is actually over the customer image before both stop
    this.stop();
  }

  stop() {
    // make the food stop moving
    this.speed_depricator = this.init_speed;
  }

  draw(ctx) {
    // Draw the food with a spin effect
    var time = new Date();
    ctx.save();
    ctx.translate(this.x_pos + this.size / 2, this.y_pos + this.size / 2);
    ctx.rotate(
      ((2 * Math.PI) / 6) * time.getSeconds() +
        ((2 * Math.PI) / 6000) * time.getMilliseconds()
    );
    ctx.drawImage(
      this.image,
      (this.size / 2) * -1,
      (this.size / 2) * -1,
      this.size,
      this.size
    );
    ctx.restore();
  }

  update(deltaTime) {
    //depracate speed to 0 to stop the food
    if (this.init_speed > 0) {
      this.init_speed = this.init_speed - this.speed_depricator;
    } else {
      this.init_speed = 0;
    }

    //deprecate fade_time to 0 to signal when to remove the food from scrn
    if (this.fade_time > 0) {
      this.fade_time = this.fade_time - this.fade_depricator;
    } else {
      this.fade_time = 0;
      this.marked_for_deletion = true;
    }
    this.x_pos += this.init_speed * this.direction;
  }
}
