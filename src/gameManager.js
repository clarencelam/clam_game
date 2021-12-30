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
  randomIntFromInterval,
  detectRectCollision
} from "/src/gameMechanics";
import { CUSTSTATE } from "/src/customer";
import { FOODSTATE } from "/src/food";
import TutorialPopup from "/src/tutorialPopup";
import EndDayPopup from "/src/endDayPopup";
import Portal from "/src/portal";

export const GAMESTATE = {
  BUSINESSDAY: 0,
  NIGHT: 1,
  MENU: 2,
  TUTORIAL: 3,
  ENDDAY: 4,
  NEXTLEVEL: 5,
  GAMEOVER: 6,
  TAXHOUSE: 7,
  INHOME: 8
};

export default class GameManager {
  constructor(gameWidth, gameHeight, ctx) {
    this.GAME_WIDTH = gameWidth;
    this.GAME_HEIGHT = gameHeight;
    this.gameStats = new GameStats();

    this.clam = new Clam(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.background = document.getElementById("background");
    this.night_bg = document.getElementById("night_bg");
    this.bullets = [];
    this.coins = [];
    this.popups = [];
    this.customers = [];
    this.portals = [];
    this.kitchen = new Kitchen(this.GAME_WIDTH, this.GAME_HEIGHT);
    //this.click = { x: null, y: null };

    this.gamestate = GAMESTATE.ENDDAY; // For now, just start with game running

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
      this.generateCustomers();
      this.customers = this.customers.filter(
        (customer) => !customer.markfordelete
      );
      this.updateCustomers(deltaTime);
      this.checkClamGettingFood();
      this.bullets = this.bullets.filter(
        (bullet) => !bullet.marked_for_deletion
      );
      this.updateBullets(this.bullets, deltaTime);
      this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);
      this.updateCoins(this.coins);
      this.clam.update(deltaTime);

      if (this.gameStats.business_day_timer <= 0) {
        this.goToGamestate(GAMESTATE.ENDDAY);
      }
    }
    // ------------------ GAMESTATE = NIGHT ------------------

    if (
      this.gamestate === GAMESTATE.NIGHT ||
      GAMESTATE.TAXHOUSE ||
      GAMESTATE.INHOME
    ) {
      this.clam.update(deltaTime);
    }

    // ------------------ GAMESTATE = ENDDAY ------------------

    if (this.gamestate === GAMESTATE.ENDDAY) {
      this.updateCustomers(deltaTime);
      this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);
      this.updateCoins(this.coins);
      this.clam.update(deltaTime);
    }

    // ------------------ GAMESTATE = TUTORIAL ------------------

    if (this.gamestate === GAMESTATE.TUTORIAL) {
      // Show popup, update objects needed in tutorial
      this.kitchen.update(deltaTime);
      this.checkClamGettingFood();
      this.bullets = this.bullets.filter(
        (bullet) => !bullet.marked_for_deletion
      );
      this.updateBullets(this.bullets, deltaTime);
      this.clam.update(deltaTime);

      if (this.clam.bullets_held.length > 0) {
        this.goToGamestate(GAMESTATE.BUSINESSDAY);
      }
    }
  }

  draw(ctx) {
    if (
      this.gamestate === GAMESTATE.BUSINESSDAY ||
      this.gamestate === GAMESTATE.ENDDAY
    ) {
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
    }

    if (this.gamestate === GAMESTATE.NIGHT) {
      ctx.drawImage(this.night_bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      // Draw square to represent the tax building
      ctx.strokeRect(this.GAME_WIDTH / 2, this.GAME_HEIGHT - 350, 200, 300);
      ctx.fillText(
        "TAX CENTER",
        this.GAME_WIDTH / 2 + 50,
        this.GAME_HEIGHT - 300
      );

      let objectstodraw = [this.kitchen, this.clam, this.gameStats];
      objectstodraw.forEach((object) => object.draw(ctx));
      // Draw portals for buildings
      this.portals.forEach((object) => object.draw(ctx));
    }

    if (this.gamestate === GAMESTATE.TAXHOUSE) {
      ctx.drawImage(
        document.getElementById("taxroom"),
        0,
        0,
        this.GAME_WIDTH,
        this.GAME_HEIGHT
      );
      this.clam.draw(ctx);
      this.portals.forEach((object) => object.draw(ctx));
    }

    if (this.gamestate === GAMESTATE.INHOME) {
      ctx.drawImage(
        document.getElementById("room"),
        0,
        0,
        this.GAME_WIDTH,
        this.GAME_HEIGHT
      );
      // Draw square to represent bed
      ctx.drawImage(
        document.getElementById("bed"),
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2,
        200,
        300
      );
      ctx.fillText("START NEXT DAY", this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);

      this.clam.draw(ctx);
      this.portals.forEach((object) => object.draw(ctx));
    }
  }

  // ------------------ MESSY HELPER FUNCTIONS ------------------

  eraseObjects() {
    this.bullets = [];
    this.coins = [];
    this.customers = [];
    this.kitchen.cooked_food = [];
    this.clam.bullets_held = [];
    this.popups = [];
    this.portals = [];
  }

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
            break;

          case GAMESTATE.ENDDAY:
            this.goToGamestate(GAMESTATE.NIGHT);
            break;

          case GAMESTATE.NIGHT:
            this.checkAndTriggerPortals(this.portals);
            break;

          case GAMESTATE.TAXHOUSE:
            this.checkAndTriggerPortals(this.portals);
            this.clam.x_pos = this.GAME_WIDTH / 2 + 10;
            this.clam.y_pos = this.GAME_HEIGHT - 150;
            break;

          case GAMESTATE.INHOME:
            this.checkAndTriggerPortals(this.portals);
            this.clam.x_pos = 250;
            this.clam.y_pos = this.GAME_HEIGHT - 100;
            break;

          default:
          //
        }
      }
    });
  }

  checkAndTriggerPortals(portals) {
    // for each portal, if intersect with clam, go to portal.gamestate
    portals.forEach((portal) => {
      if (detectRectCollision(portal, this.clam)) {
        console.log(portal);
        this.goToGamestate(portal.getGamestate());
        console.log("entered: " + this.gamestate);
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
      initializeCooking(this.kitchen);
      initializeTimer(this.gameStats);
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

    if (gamestate === GAMESTATE.ENDDAY) {
      this.kitchen.cooking = false;
      this.gamestate = GAMESTATE.ENDDAY;
      this.popups.push(
        new EndDayPopup(
          this.GAME_WIDTH,
          this.GAME_HEIGHT,
          this.gameStats.days_fedcusts,
          this.gameStats.days_dollars,
          this.gameStats.days_tax
        )
      );
    }

    // ----- ACTIONS TO TRANSITION TO GAMESTATE.NIGHT -----
    if (gamestate === GAMESTATE.NIGHT) {
      this.kitchen.cooking = false;
      this.eraseObjects();
      this.gamestate = GAMESTATE.NIGHT;
      this.portals.push(
        new Portal(
          this.GAME_WIDTH / 2 + 10,
          this.GAME_HEIGHT - 150,
          GAMESTATE.TAXHOUSE
        )
      );
      this.portals.push(
        new Portal(250, this.GAME_HEIGHT - 100, GAMESTATE.INHOME)
      );
    }

    if (gamestate === GAMESTATE.TAXHOUSE) {
      this.eraseObjects();
      this.gamestate = GAMESTATE.TAXHOUSE;
      this.portals.push(
        new Portal(50, this.GAME_HEIGHT - 100, GAMESTATE.NIGHT)
      );
      this.clam.x_pos = 50;
      this.clam.y_pos = this.GAME_HEIGHT - 100;
    }

    if (gamestate === GAMESTATE.INHOME) {
      this.eraseObjects();
      this.gamestate = GAMESTATE.INHOME;
      this.portals.push(
        new Portal(50, this.GAME_HEIGHT - 100, GAMESTATE.NIGHT)
      );
      this.clam.x_pos = 50;
      this.clam.y_pos = this.GAME_HEIGHT - 100;
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
  }

  generateCustomers() {
    // reload customers array (temporary code, will flesh out cust gen)
    if (this.customers.length < 15) {
      this.customers.push(new Customer(this.GAME_WIDTH, this.GAME_HEIGHT));
    }
  }

  updateCoins(coins) {
    coins.forEach((coin) => {
      if (detectCollision(coin, this.clam)) {
        coin.marked_for_deletion = true;
        // Accrue gameStats
        this.gameStats.dollars = this.gameStats.dollars + coin.value;
        this.gameStats.days_dollars = this.gameStats.days_dollars + coin.value;
      }
    });
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

function initializeTimer(gameStats) {
  // if day timer is not on, turn on, and count down. If 0, end day
  var startDayTimer = setInterval(incrementTime, gameStats.advance_interval);
  function incrementTime() {
    gameStats.business_day_timer--;
    // If timer ends, end business day functions
    if (gameStats.business_day_timer <= 0) {
      clearInterval(startDayTimer);
    }
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

    // if this.cooking is false, then stop the kitchen cooking interval loop
    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }

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
  }
}

/* THIS FUNCTION IN THE GameManager class does not work: the gameStats.business_day_timer only increments one time and stops
  initializeTimer() {
    // if day timer is not on, turn on, and count down. If 0, clear timer
    var startDayTimer = setInterval(
      incrementTime(this.gameStats),
      this.gameStats.advance_interval
    );
    function incrementTime(stats) {
      stats.business_day_timer--;
      // If timer ends, end business day functions
      if (stats.business_day_timer <= 0) {
        clearInterval(startDayTimer);
      }
      return stats.business_day_timer
    }
  }
  */

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
