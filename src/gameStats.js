export default class GameStats {
  constructor(gamewidth, gameheight) {
    this.daysTaxPaid = false;
    this.GAME_WIDTH = gamewidth;
    this.GAME_HEIGHT = gameheight;

    this.dollars = 0;
    this.day = 1;

    this.timerOn = false;
    this.business_day_timer = 5;

    this.advance_interval = 1000; //one second = two minute passes in timer

    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.days_tax = 2;
    this.lives = 10;

    this.display_height = 40;
    this.display_width = 400;
    this.display_xpos = 0;
    this.display_ypos = 0;
    this.text_ypos = this.display_ypos + 75;
    this.symbol_ypos = this.display_ypos + 50;
    this.start_xpos = 210;

    this.sign_img = document.getElementById("sign");
    this.coin_img = document.getElementById("coin_img");
    this.clam_img = document.getElementById("clam_default");
    this.clock_img = document.getElementById("clock");
    this.day_img = document.getElementById("day");
    this.night_img = document.getElementById("night");

    this.coin_size = 25;
    this.sign_height = 60;
    this.sign_width = 600;
  }

  resetLevel() {
    // perform the reset of objects needed to go to another level
    this.days_dollars = 0;
    this.days_fedcusts = 0;
    this.timerOn = false;
    this.business_day_timer = 20;
    this.daysTaxPaid = false;
  }

  gameOver() {
    // perform reset of objects needed to reset game
    this.day = 1;
    this.dollars = 0;
    this.days_tax = 2;
    this.lives = 10;
    this.resetLevel();
  }

  incrementLevel() {
    // Increment objects to make the next level harder
    this.days_tax = this.days_tax + 1;
    this.day++;
  }

  update() {}
  draw(ctx) {
    ctx.textAlign = "right";
    ctx.font = "25px Tahoma";
    ctx.fillStyle = "black";
    ctx.drawImage(this.sign_img, this.display_xpos, this.display_ypos);

    // DRAW # COINS
    ctx.drawImage(
      this.coin_img,
      this.start_xpos,
      this.symbol_ypos,
      this.coin_size,
      this.coin_size
    );
    ctx.fillText(this.dollars, this.start_xpos + 120, this.text_ypos);

    // DRAW BUSINESS DAY TIMER
    ctx.drawImage(
      this.clock_img,
      this.start_xpos + 205,
      this.symbol_ypos,
      this.coin_size,
      this.coin_size
    );
    ctx.fillText(
      this.business_day_timer,
      this.start_xpos + 280,
      this.text_ypos
    );

    // DRAW LIVES LEFT
    ctx.drawImage(
      this.clam_img,
      this.start_xpos + 350,
      this.symbol_ypos,
      30,
      30
    );
    ctx.fillText(this.lives, this.start_xpos + 420, this.text_ypos);

    // DRAW DAY #
    ctx.drawImage(
      this.day_img,
      this.start_xpos + 790,
      this.symbol_ypos,
      30,
      30
    );
    ctx.fillText("DAY " + this.day, this.start_xpos + 900, this.text_ypos);
  }
}

/*

    ctx.fillRect(
      this.display_xpos,
      this.display_ypos,
      this.display_width,
      this.display_height
    );
*/
