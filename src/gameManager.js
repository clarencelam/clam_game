import GameStats from "/src/gameStats";
import Clam from "/src/clam";
import InputHandler from "/src/input";
import Kitchen from "/src/kitchen";
import Customer from "/src/customer";
import Coin from "/src/coin";
import Food from "/src/food";
import {
  detectCollision,
  detectOverlapCollision,
  randomIntFromInterval
} from "/src/gameMechanics";
import { CUSTSTATE } from "/src/customer";

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
  constructor(gameWidth, gameHeight, ctx) {
    this.GAME_WIDTH = gameWidth;
    this.GAME_HEIGHT = gameHeight;
    this.gameStats = new GameStats();

    this.clam = new Clam(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.background = document.getElementById("background");
    this.bullets = [];
    this.coins = [];
    this.popups = [];
    this.customers = [];
    this.kitchen = new Kitchen(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.gamestate = GAMESTATE.BUSINESSDAY; // For now, just start with game running

    new InputHandler(ctx, this.clam);
    this.spacebarHandler();

    /*
    document.addEventListener("click", (event) => {
      this.bullets.push(new Food(10, 10, this.clam.facing));
    });
    */
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

    // ------------------ GAMESTATE = BUSINESSDAY ------------------

    if (this.gamestate === GAMESTATE.BUSINESSDAY) {
      this.kitchen.update(deltaTime);
      initializeCooking(this.kitchen);

      this.customers = this.customers.filter(
        (customer) => !customer.markfordelete
      );
      this.updateCustomers(deltaTime);

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

  spacebarHandler() {
    // Actions for spacebar pressing to perform, based on gamestate
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 32) {
        switch (this.gamestate) {
          // ----- GAMESTATE = BUSINESSDAY -----
          case GAMESTATE.BUSINESSDAY:
            if (this.clam.bullets_held.length > 0) {
              this.bullets.push(
                new Food(this.clam.x_pos, this.clam.y_pos, this.clam.facing)
              );
              this.clam.bullets_held.shift(); // removes last item in array
              this.clam.shooting = true;
            }
            break;

          default:
          //
        }
      }
    });
  }

  // TODO: revise customer gen logic
  updateCustomers(deltaTime) {
    // Updating and drawing customers each frame
    this.customers.forEach((customer, index) => {
      customer.update(deltaTime);
      if (customer.hunger_points <= 0) {
        if (customer.state === CUSTSTATE.DROPPINGLOOT) {
          this.dropCoin(customer);
          this.gameStats.days_fedcusts++;
          customer.state = CUSTSTATE.EXITING;
        }
      }
    });

    // reload customers array (temporary code, will flesh out cust gen)
    if (this.customers.length < 3) {
      this.customers.push(new Customer(this.GAME_WIDTH, this.GAME_HEIGHT));
    }
  }

  // TODO: refactor this?
  updateBullets(deltaTime) {
    //function to update bullets each loop
    this.bullets.forEach((bullet, index) => {
      this.customers.forEach((customer, index) => {
        if (detectOverlapCollision(bullet, customer)) {
          // if bullets are colliding:
          if (customer.state === CUSTSTATE.ACTIVE) {
            // trigger customer eating process if customer has not yet begun
            this.triggerCustEatingFood(customer, bullet, this.gameStats);
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

  triggerCustEatingFood(customer, bullet, gameStats) {
    // Actions for Customer to perform when they hit Food in game
    customer.state = CUSTSTATE.EATING;

    // Code to represent the customer "eating" the food
    let eat_interval = setInterval(takeBite, 750);
    function takeBite() {
      customer.hunger_points = customer.hunger_points - bullet.hunger_fill;

      if (customer.hunger_points <= 0) {
        clearInterval(eat_interval);
        console.log("Hunger depleted");
        customer.state = CUSTSTATE.DROPPINGLOOT;
      }
    }
  }

  // related to custEatingFood above
  dropCoin(customer) {
    // Function to make customer drop coin
    this.coins.push(
      new Coin(
        customer.x_pos + customer.width / 2,
        customer.y_pos + customer.height / 2,
        customer.drop_value
      )
    );
    console.log("dropCoin function activated");
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
// intitialize cooking TODO: Clean up

function initializeCooking(kitchen) {
  if (kitchen.cooking === false) {
    var kitchenCooking = setInterval(cookFood, kitchen.cook_time);
    kitchen.cooking = true;
  }

  // cookfood interval function
  function cookFood() {
    // Cook a food bullet into the kitchen if space is available

    if (kitchen.cooked_food.length < kitchen.max_food) {
      // Generate random y point within food truck window
      this.rndBinary = randomIntFromInterval(
        kitchen.y_pos + kitchen.truck_height * (2 / 5), // top of truck window
        kitchen.y_pos + kitchen.truck_height * (3 / 5) - 5 // bottom of truck window
      );

      kitchen.cooked_food.push(
        // push new food item to food truck
        new Food(kitchen.x_pos + 30, this.rndBinary, 1, true, this.kitchen)
      );
    } else {
    }

    // if this.cooking is false, then stop the kitchen cooking interval loop
    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }
  }
}
