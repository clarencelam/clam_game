import { randomIntFromInterval, incrementalAction } from "/src/gameMechanics";
export default class Customer {
  // class to represent the cusomter fish that player will feed

  constructor(gameHeight, gameWidth) {
    this.img_frame1 = document.getElementById("fish_1");
    this.img_frame2 = document.getElementById("fish_2");
    this.size = 80;
    this.speed = 4;
    this.return_speed = 4;
    this.hunger_points = 10;
    this.markfordelete = false;
    this.GAMEWIDTH = gameWidth;
    this.hit = false;
    this.hunger_points = 2;
    this.min = 0;
    this.max = gameHeight * 0.75;
    this.rndBinary = randomIntFromInterval(1, 2);
    this.done_dropping_coin = false;
    const rndInt = randomIntFromInterval(this.min, this.max);

    if (this.rndBinary === 1) {
      this.x_pos = gameWidth - this.size; // Start on right side
    } else {
      this.x_pos = 0; // Start on left side
    }
    this.y_pos = rndInt;

    if (this.rndBinary === 1) {
      this.x_direction = -1;
    } else {
      this.x_direction = 1;
    }
    this.y_direction = 0; //no vertical movement to start

    //CUSTOMER STATES
    this.walking = true;
    this.stopped = false;

    // variable to declare where the customer will stop & turn around
    this.x_walk_threshold = this.size * 2;
    // time waited after customer gets to walk threshold
    this.wait_time = 150;
  }

  doneEating() {
    this.y_direction = -1;
    this.walking = true;
    this.stopped = false;
    this.apply_return_speed();
    if (this.y_pos <= 0) {
      this.markfordelete = true;
    }
  }

  hitFood(bullet) {
    this.stop();
  }

  stop() {
    this.speed = 0;
    this.walking = false;
    this.stopped = true;
  }

  apply_return_speed() {
    this.speed = this.return_speed;
  }

  draw(ctx) {
    // swap the image frames per second when cust is walking
    const newtime = new Date();
    let s = newtime.getMilliseconds();
    if (this.walking === true) {
      if (s < 500) {
        this.img = this.img_frame1;
      } else {
        this.img = this.img_frame2;
      }
    }

    if (this.rndBinary === 2) {
      //facing right
      ctx.translate(this.x_pos + this.size, this.y_pos);
      // scaleX by -1; this "trick" flips horizontally
      ctx.scale(-1, 1);
      // draw the img
      // no need for x,y since we've already translated
      ctx.drawImage(this.img, 0, 0, this.size, this.size);
      // always clean up -- reset transformations to default
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(this.img, this.x_pos, this.y_pos, this.size, this.size);
    }
  }

  checkOutsideBorders() {
    // Delete customers when they cross the screen & exit
    if (
      (this.x_pos > this.GAMEWIDTH && this.x_direction === 1) ||
      (this.x_pos + this.size < 0 && this.x_direction === -1)
    ) {
      this.markfordelete = true;
    }
  }

  update(deltaTime) {
    if (this.hunger_points <= 0) {
      this.doneEating();
    }
    // Movement
    this.x_pos = this.x_pos + this.speed * this.x_direction;
    this.y_pos = this.y_pos + this.speed * this.y_direction;

    // if cust
    this.checkOutsideBorders();
  }
}
