export default class Coin {
  // Class to represent coin objects
  constructor(x, y) {
    this.image = document.getElementById("coin_img");
    this.x_pos = x;
    this.y_pos = y;
    this.size = 25;
    this.marked_for_deletion = false;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x_pos, this.y_pos, 25, 25);
  }

  update(deltaTime) {
    return;
  }
}
