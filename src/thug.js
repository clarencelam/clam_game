export const THIEFSTATE = {
  WALKING: 0,
  STEALING: 1,
  STANDING: 2,
  EXITING: 3,
  ATTACKING: 4
};

export default class Thug {
  // class to represent the cusomter fish that player will feed
  constructor(gameWidth, gameHeight) {
    this.GAMEWIDTH = gameWidth;
    this.GAMEHEIGHT = gameHeight;
    this.state = THIEFSTATE.WALKING;

    this.img_frame1 = document.getElementById("thugA1");
    this.img_frame2 = document.getElementById("thugA2");
    this.img_standing = document.getElementById("thugA3");
    this.img_attack1 = document.getElementById("thugA4");
    this.img_attack2 = document.getElementById("thugA5");

    this.height = 65;
    this.width = 60;
    this.atk_height = 80;
    this.atk_width = 90;

    this.speed = 2;
    this.x_direction = 1;
    this.y_direction = 1;

    this.x_pos = 10;
    this.y_pos = 10;
    this.markfordelete = false;
    this.randomMovementOn = false;
    this.randomMovementInterval = 1000;
  }

  update(deltaTime) {
    // Movement
    if (this.x_direction === 0 && this.y_direction === 0) {
      this.state = THIEFSTATE.STANDING;
    }
    if (this.state === THIEFSTATE.WALKING) {
      this.bounceBorders();
      this.x_pos = this.x_pos + this.speed * this.x_direction;
      this.y_pos = this.y_pos + this.speed * this.y_direction;

      const newtime = new Date();
      let s = newtime.getMilliseconds();
      if (s < 500) {
        this.img = this.img_frame1;
      } else {
        this.img = this.img_frame2;
      }
    } else if (
      this.state === THIEFSTATE.ATTACKING &&
      this.attacking === false
    ) {
      this.attacking = true;
      this.randomMovementOn = false;
      this.img = this.img_attack2;
      setTimeout(goBackWalking, 1000);
    } else if (this.state === THIEFSTATE.STANDING) {
      this.img = this.img_standing;
    }
    function goBackWalking() {
      this.state = THIEFSTATE.WALKING;
      this.randomMovementOn = true;
      this.attacking = false;
    }
  }

  bounceBorders() {
    if (this.x_pos <= 0) {
      this.x_direction = this.x_direction * -1;
    }
    if (this.x_pos + this.width >= this.GAMEWIDTH) {
      this.x_direction = this.x_direction * -1;
    }
    if (this.y_pos <= 0) {
      this.y_direction = this.y_direction * -1;
    }
    if (this.y_pos + this.height >= this.GAMEHEIGHT) {
      this.y_direction = this.y_direction * -1;
    }
  }

  draw(ctx) {
    // swap the image frames per second when cust is walking
    if (this.state === THIEFSTATE.ATTACKING) {
      this.img = this.img_attack2;
      if (this.x_direction === 1) {
        ctx.translate(this.x_pos + this.atk_width, this.y_pos);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.atk_width, this.atk_height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        ctx.drawImage(
          this.img,
          this.x_pos,
          this.y_pos,
          this.atk_width,
          this.atk_height
        );
      }
    } else {
      if (this.x_direction === 1) {
        ctx.translate(this.x_pos + this.width, this.y_pos);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        ctx.drawImage(
          this.img,
          this.x_pos,
          this.y_pos,
          this.width,
          this.height
        );
      }
    }
  }
}
