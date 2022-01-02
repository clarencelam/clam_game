export const THIEFSTATE = {
  ACTIVE: 0,
  STEALING: 1
};

export default class Thug {
  // class to represent the cusomter fish that player will feed
  constructor(gameWidth, gameHeight) {
    this.GAMEWIDTH = gameWidth;
    this.GAMEHEIGHT = gameHeight;
    this.state = THIEFSTATE.ACTIVE;

    this.img_frame1 = document.getElementById("thugA1");
    this.img_frame2 = document.getElementById("thugA2");

    this.height = 65;
    this.width = 60;

    this.speed = 2;
    this.x_direction = 1;
    this.y_direction = 1;

    this.x_pos = 10;
    this.y_pos = 10;
    this.markfordelete = false;
  }

  update(deltaTime) {
    // Movement
    this.x_pos = this.x_pos + this.speed * this.x_direction;
    this.y_pos = this.y_pos + this.speed * this.y_direction;
  }

  draw(ctx) {
    // swap the image frames per second when cust is walking
    const newtime = new Date();
    let s = newtime.getMilliseconds();
    if (this.state === THIEFSTATE.ACTIVE) {
      if (s < 500) {
        this.img = this.img_frame1;
      } else {
        this.img = this.img_frame2;
      }
    }
    ctx.drawImage(this.img, this.x_pos, this.y_pos, this.width, this.height);
  }
}
