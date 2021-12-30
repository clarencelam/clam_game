export default class Portal {
  // Class to represent coin objects
  constructor(x, y, gotogamestate) {
    this.image = document.getElementById("portal");
    this.gotogamestate = gotogamestate;
    this.x_pos = x;
    this.y_pos = y;
    this.height = 180;
    this.width = 80;
    this.marked_for_deletion = false;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x_pos, this.y_pos, this.height, this.width);
  }

  update(deltaTime) {
    return;
  }
}
