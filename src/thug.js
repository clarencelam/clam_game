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

    this.scaleup = 20;
    this.height = 65 + this.scaleup;
    this.width = 60 + this.scaleup;
    this.atk_height = 80 + this.scaleup;
    this.atk_width = 90 + this.scaleup;

    this.speed = 2;
    this.x_direction = 1;
    this.y_direction = 1;

    this.img = document.getElementById("thugA1");

    this.x_pos = 10;
    this.y_pos = 10;
    this.markfordelete = false;
    this.randomMovementOn = false;
    this.randomMovementInterval = 3000;

    this.attacking = false;
  }

  prepAttack() {
    this.img = this.img_attack1;
  }

  goBackWalking() {
    this.randomMovementOn = true;
    this.attacking = false;
    this.state = THIEFSTATE.WALKING;
    console.log("thug should go Back Walking, ready for next attack");
  }

  update(deltaTime) {
    // check if thug is stopped

    switch (this.state) {
      case THIEFSTATE.WALKING:
        this.attacking = false;
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
        break;

      case THIEFSTATE.ATTACKING:
        break;

      case THIEFSTATE.STANDING:
        this.img = this.img_standing;
        break;

      default:
      //
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
