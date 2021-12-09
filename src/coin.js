export default class Coin {
  // Class to represent the food objects used as bullets in the game
  constructor(x, y) {
    this.image = document.getElementById("coin_img");
    this.x_pos = x;
    this.y_pos = y;
    this.size = 25;
  }

  draw(ctx) {
    // Draw the food with a spin effect
    ctx.drawImage(this.image, this.x_pos, this.y_pos, this.size, this.size);
  }

  update(deltaTime) {
    //depracate speed to 0 to stop the food
  }
}

/*
export default class Coin {
  // Class to represent coin objects
  constructor(x, y) {
    this.image = document.getElementById("nigiri_img");
    this.x_pos = x;
    this.y_pos = y;
    this.size = 25;
    this.marked_for_deletion = false;
  }

  draw(ctx) {
    ctx.drawImage(this.image, 25, 25, 25, 25);
    ctx.drawImage(this.img, 0, 0, this.size, this.size);
  }

  update(deltaTime) {
    return;
  }
}
*/
