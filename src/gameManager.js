import GameStats from "/src/gameStats";
import Clam from "/src/clam";
import InputHandler from "/src/input";
import Kitchen from "/src/kitchen";
import Customer from "/src/customer";
import Coin from "/src/coin";

import { detectCollision, detectOverlapCollision } from "/src/gameMechanics";

const GAMESTATE = {
  BUSINESSDAY: 0,
  NIGHT: 1,
  MENU: 2,
  STARTLEVEL: 3,
  ENDLEVEL: 4,
  NEXTLEVEL: 5,
  GAMEOVER: 6
};

export default class GameManager {
  constructor(gameWidth, gameHeight) {
    this.GAME_WIDTH = gameWidth;
    this.GAME_HEIGHT = gameHeight;
    this.gameStats = new GameStats();

    this.clam = new Clam(this.GAME_WIDTH, this.GAME_HEIGHT);
    new InputHandler(this.clam);

    this.background = document.getElementById("background");
    this.bullets = [];
    this.coins = [];
    this.popups = [];
    this.customers = [];
    this.kitchen = new Kitchen(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.gamestate = GAMESTATE.BUSINESSDAY; // For now, just start with game running
  }

  start() {
    //
  }

  update(deltaTime) {
    if (this.gameStats.coins < 0) {
      this.gamestate = GAMESTATE.GAMEOVER;
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      return;
    }

    if (this.gamestate === GAMESTATE.BUSINESSDAY) {
      this.kitchen.update();
      this.customers = this.customers.filter(
        (customer) => !customer.markfordelete
      );
      this.updateCustomers(this.customers, deltaTime);

      this.checkClamGettingFood();

      this.bullets = this.bullets.filter(
        (bullet) => !bullet.marked_for_deletion
      );
      this.updateBullets(this.bullets, deltaTime);

      //update coins TODO: refacor
      this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);

      this.coins.forEach((coin, index) => {
        if (detectCollision(coin, this.clam)) {
          coin.marked_for_deletion = true;
          // Accrue gameStats
          this.gameStats.dollars = this.gameStats.dollars + coin.value;
          this.gameStats.days_dollars =
            this.gameStats.days_dollars + coin.value;
        }
      });

      this.clam.update(deltaTime);
    }
  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.BUSINESSDAY) {
      ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      this.kitchen.draw(ctx);

      // draw customers
      this.customers.forEach((customer, index) => {
        customer.draw(ctx);
      });

      // draw bullets
      this.bullets.forEach((bullet, index) => {
        bullet.draw(ctx);
      });

      this.coins.forEach((coin, index) => {
        coin.draw(ctx);
      });

      this.clam.draw(ctx);

      this.popups.forEach((popup) => {
        popup.draw(ctx);
      });

      this.gameStats.draw(ctx);
    }
  }

  // ------------------ MESSY HELPER FUNCTIONS ------------------

  // TODO: revise customer gen logic
  updateCustomers(customers, deltaTime) {
    // Updating and drawing customers each frame
    customers.forEach((customer, index) => {
      customer.update(deltaTime);
    });
    // reload customers array (temporary code, will flesh out cust gen)
    if (customers.length < 3) {
      customers.push(new Customer(this));
    }
  }

  // TODO: refactor this?
  updateBullets(deltaTime) {
    //function to update bullets each loop
    this.bullets.forEach((bullet, index) => {
      this.customers.forEach((customer, index) => {
        if (detectOverlapCollision(bullet, customer)) {
          // if bullets are colliding:
          // trigger customer eating process if customer has not yet begun
          if (customer.hit === false) {
            this.custEatingFood(bullet, customer, this.coins);
          }
          // trigger food being eaten process if food has not yet
          if (bullet.food_hit === false) {
            this.foodBeingEaten(bullet, customer);
          }
        }
      });
      bullet.update(deltaTime);
    });
  }
  // related to updateBullets above
  custEatingFood(bullet, customer, coins) {
    // Actions for Customer to perform when they hit Food in game
    customer.hit = true;
    customer.hitFood(bullet);

    // Code to represent the customer "eating" the food
    var eatTime = setInterval(custEat, 750);
    function custEat() {
      const fill_points = 1;
      customer.hunger_points = customer.hunger_points - fill_points;

      if (customer.hunger_points <= 0) {
        // drop coin if customer hasnt yet
        if (customer.done_dropping_coin === false) {
          this.dropCoin(customer, coins);
          customer.done_dropping_coin = true;
        }

        clearInterval(eatTime);
        // accrue GameStats stats
        this.gameStats.days_fedcusts++;
      }
    }
  }
  // related to custEatingFood above
  dropCoin(customer, coins) {
    // Function to make customer drop coin
    coins.push(
      new Coin(
        customer.x_pos + customer.width / 2,
        customer.y_pos + customer.height / 2
      )
    );
    console.log("dropCoin function activated");
    console.log(coins);
  }

  // silly code to make food shrink when hit
  foodBeingEaten(bullet, customer) {
    bullet.food_hit = true;
    bullet.hitCustomer(customer);

    var intervalId = setInterval(biteShrink, 750);

    function biteShrink() {
      const shrinkAmount = 25;
      bullet.size = bullet.size - shrinkAmount;
      bullet.x_pos = bullet.x_pos + shrinkAmount / 2;
      bullet.y_pos = bullet.y_pos + shrinkAmount / 2;

      if (bullet.size <= 0) {
        clearInterval(intervalId);
      }
    }
  }

  // TODO: refactor out of gameManager. Maybe this can be a function in kitchen?
  checkClamGettingFood() {
    // Detect collision between clam and kitchen food
    this.kitchen.cooked_food.forEach((food, index) => {
      if (detectCollision(this.clam, food)) {
        food.marked_for_deletion = true;
        this.clam.newBullet();
      }
    });
  }
}