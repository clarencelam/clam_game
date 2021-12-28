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
import { FOODSTATE } from "/src/food";
import TutorialPopup from "/src/tutorialPopup";

const GAMESTATE = {
  BUSINESSDAY: 0,
  NIGHT: 1,
  MENU: 2,
  TUTORIAL: 3,
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
    //this.click = { x: null, y: null };

    this.gamestate = GAMESTATE.MENU; // For now, just start with game running

    new InputHandler(ctx, this.clam);
    this.spacebarHandler();
  }

  start() {
    // Start new level
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

    if (this.gamestate === GAMESTATE.TUTORIAL) {
      // Show popup, update objects needed in tutorial
      this.kitchen.update(deltaTime);
      this.checkClamGettingFood();
      this.bullets = this.bullets.filter(
        (bullet) => !bullet.marked_for_deletion
      );
      this.updateBullets(this.bullets, deltaTime);
      this.clam.update(deltaTime);

      return;
    }
  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.BUSINESSDAY) {
      ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

      this.kitchen.draw(ctx);

      [
        ...this.customers,
        ...this.bullets,
        ...this.coins,
        ...this.popups
      ].forEach((object) => object.draw(ctx));
      this.customers.forEach((cust) => cust.draw(ctx));

      this.clam.draw(ctx);

      this.gameStats.draw(ctx);
    }

    if (this.gamestate === GAMESTATE.MENU) {
      ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      ctx.font = "40px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      ctx.fillText(
        "Press SPACEBAR to start game",
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2 + 50
      );
    }

    if (this.gamestate === GAMESTATE.TUTORIAL) {
      // Draw objects needed for tutorial
      ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      this.kitchen.draw(ctx);
      [...this.bullets, ...this.popups].forEach((object) => object.draw(ctx));
      this.clam.draw(ctx);
      this.gameStats.draw(ctx);
      if (this.clam.bullets_held.length > 0) {
        this.goToGamestate(GAMESTATE.BUSINESSDAY);
      }
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
          case GAMESTATE.MENU:
            this.goToGamestate(GAMESTATE.TUTORIAL);

          default:
          //
        }
      }
    });
  }

  goToGamestate(gamestate) {
    console.log("GAMESTATE: " + this.gamestate);

    // ----- ACTIONS TO TRANSITION TO GAMESTATE.BUSINESSDAY -----
    if (gamestate === GAMESTATE.BUSINESSDAY) {
      this.popups = [];
      this.bullets = [];
      this.customers = [];
      this.coins = [];
      this.gamestate = GAMESTATE.BUSINESSDAY;
    }

    if (gamestate === GAMESTATE.TUTORIAL) {
      this.gamestate = GAMESTATE.TUTORIAL;
      // push 1 food for tutorial purposes
      this.kitchen.cooked_food.push(
        new Food(
          20,
          this.GAME_HEIGHT - 160,
          1,
          FOODSTATE.INKITCHEN,
          this.kitchen
        )
      );
      this.popups.push(
        new TutorialPopup(
          this.GAME_WIDTH,
          this.GAME_HEIGHT,
          this.gameStats.business_day_timer,
          this.gameStats.days_tax
        )
      );
    }
  }

  updateBullets(deltaTime) {
    //function to update bullets each loop
    this.bullets.forEach((bullet, index) => {
      for (var i = 0; i < this.customers.length; i++) {
        let thecustomer = this.customers[i];
        if (detectOverlapCollision(bullet, thecustomer)) {
          // trigger food being eaten process if food has not yet
          if (
            bullet.state === FOODSTATE.SERVED &&
            thecustomer.saturated === false
          ) {
            thecustomer.saturated = true;
            this.foodBeingEaten(bullet, thecustomer);
            bullet.state = FOODSTATE.BEINGEATEN;
          }
        }
      }

      bullet.update(deltaTime);
    });
  }

  // TODO: revise customer gen logic
  updateCustomers(deltaTime) {
    // Updating and drawing customers each frame
    this.customers.forEach((customer, index) => {
      customer.update(deltaTime);

      // Drop loot
      if (customer.hunger_points <= 0) {
        if (customer.state === CUSTSTATE.DROPPINGLOOT) {
          this.dropCoin(customer);
          this.gameStats.days_fedcusts++;
          customer.state = CUSTSTATE.EXITING;
        }
      }
      // Check collision with Bullets
      for (var i = 0; i < this.bullets.length; i++) {
        let thebullet = this.bullets[i];
        if (detectOverlapCollision(thebullet, customer)) {
          if (
            customer.state === CUSTSTATE.ACTIVE &&
            thebullet.state === FOODSTATE.SERVED
          ) {
            this.triggerCustEatingFood(customer, thebullet);
          }
        }
      }
    });

    // reload customers array (temporary code, will flesh out cust gen)
    if (this.customers.length < 15) {
      this.customers.push(new Customer(this.GAME_WIDTH, this.GAME_HEIGHT));
    }
  }

  triggerCustEatingFood(customer, bullet) {
    // Actions for Customer to perform when they hit Food in game. Tried to refactor this to Cust object, coudln't get it to work.
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
    var intervalId = setInterval(biteShrink, 300);
    function biteShrink() {
      const shrinkAmount = 10;
      bullet.size = bullet.size - shrinkAmount;
      bullet.x_pos = bullet.x_pos + shrinkAmount / 2;
      bullet.y_pos = bullet.y_pos + shrinkAmount / 2;

      if (
        customer.state === CUSTSTATE.DROPPINGLOOT ||
        customer.state === CUSTSTATE.EXITING
      ) {
        clearInterval(intervalId);
        bullet.marked_for_deletion = true;
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
        new Food(
          kitchen.x_pos + 30,
          this.rndBinary,
          1,
          FOODSTATE.INKITCHEN,
          this.kitchen
        )
      );
    } else {
    }

    // if this.cooking is false, then stop the kitchen cooking interval loop
    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }
  }
}

/*
  clickToChangeGamestate(object, gamestate) {
    document.addEventListener("click", (event) => {
      let rect = this.ctx.getBoundingClientRect();
      this.click.x = event.clientX - rect.left;
      this.click.y = event.clientY - rect.top;
      console.log(this.click);
    });
    if (this.isIntersect(this.click, object)) {
      this.gamestate = gamestate;
    }
  }

  isIntersect(point, object) {
    if (point.x > object.x_pos && point.x < object.x_pos + object.height) {
      return true;
    } else {
      return false;
    }
  }
*/
