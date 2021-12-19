import Clam from "/src/clam";
import InputHandler from "/src/input";
import Food from "/src/food";
import Customer from "/src/customer";
import Coin from "/src/coin";
import GameStats from "/src/gameStats";
import Kitchen from "/src/kitchen";
import FoodSprite from "/src/foodSprite";
import {
  detectCollision,
  foodShrink,
  detectOverlapCollision,
  incrementalAction,
  eatFood,
  randomIntFromInterval
} from "/src/gameMechanics";
import EndDayPopup from "./endDayPopup";
import BeginDayPopup from "./beginDayPopup";

// -------------- INITIALIZE GAME OBJECTS ----------------
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
canvas.height = GAME_HEIGHT;
canvas.width = GAME_WIDTH;

let background = document.getElementById("background");

let clam = new Clam(GAME_WIDTH, GAME_HEIGHT);
let bullets = [];
let coins = [];
let popups = [];
let customers = [];
let lastTime = 0;
let gameStats = new GameStats();
let kitchen = new Kitchen(GAME_HEIGHT, GAME_WIDTH);

new InputHandler(clam);

// --------------- MAIN GAMELOOP --------------------------
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (gameStats.game_active === true) {
    // update and draw kitchen objects
    kitchen.update();
    kitchen.draw(ctx);

    if (gameStats.business_day_active === true) {
      // Game actions only to occur if business day is active

      // Perform the kitchen cooking loop
      initializeKitchen(kitchen);
      initializeTimer();

      // update and draw customer objects
      customers = customers.filter((customer) => !customer.markfordelete);
      updateCustomers(customers, deltaTime);
    }

    // check if clam is over a food
    checkClamGettingFood();

    //update and draw coin objects
    coins = coins.filter((coin) => !coin.marked_for_deletion);

    coins.forEach((coin, index) => {
      if (detectCollision(coin, clam)) {
        coin.marked_for_deletion = true;
        // Accrue gameStats
        gameStats.dollars = gameStats.dollars + coin.value;
        gameStats.days_dollars = gameStats.days_dollars + coin.value;
      }
      coin.draw(ctx);
    });

    if (
      // if level start window is active and has not been triggered, add the start window popup to popups array
      gameStats.show_lvlstart_window === true &&
      gameStats.triggered_lvlstart_window === false
    ) {
      initializeLevelStartPopup();
    }

    // update and draw bullets
    bullets = bullets.filter((bullet) => !bullet.marked_for_deletion);
    updateBullets(bullets, deltaTime);

    // update and draw clam character
    clam.update(deltaTime);
    clam.draw(ctx);

    // draw popup boxes
    popups.forEach((popup) => {
      popup.draw(ctx);
    });

    // update and draw game score, lives, other stats
    gameStats.draw(ctx);
  }

  requestAnimationFrame(gameLoop);
}

// ----------------- HELPER FUNCTIONS --------------------------

export function spacebarTrigger() {
  // Perform activites for when spacebar is pressed

  // if levelstart popup window is present, pressing space bar will start level
  if (gameStats.show_lvlstart_window === true) {
    // if clam
    startLevel();
  }

  // if clam bullet length > 0, fire bullet
  if (clam.bullets_held.length > 0) {
    bullets.push(new Food(clam.x_pos, clam.y_pos, clam.facing));
    clam.bullets_held.shift(); // removes last item in array
  }
}

function startLevel() {
  //actions to take when level is started
}

function initializeLevelStartPopup() {
  // actions to take when level is started but the popup is not initialized
  gameStats.triggered_lvlstart_window = true;
  gameStats.business_day_active = false;
  popups.push(
    new BeginDayPopup(
      GAME_WIDTH,
      GAME_HEIGHT,
      gameStats.day,
      gameStats.business_day_timer,
      gameStats.days_tax
    )
  );
}

function initializeTimer() {
  // if day timer is not on, turn on, and count down. If 0, end day
  if (gameStats.timerOn === false) {
    var startDayTimer = setInterval(incrementTime, gameStats.advance_interval);
    function incrementTime() {
      gameStats.business_day_timer--;
      // If timer ends, end business day functions
      if (gameStats.business_day_timer <= 0) {
        endBusinessDay();
        clearInterval(startDayTimer);
      }
    }
    gameStats.timerOn = true;
  }
}

function endBusinessDay() {
  // END OF BUSINESS DAY BEHAVIORS
  gameStats.business_day_active = false;
  kitchen.cooking = false;
  console.log(gameStats.days_fedcusts);
  console.log(gameStats.days_dollars);
  popups.push(
    new EndDayPopup(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      gameStats.days_fedcusts,
      gameStats.days_dollars
    )
  );
  gameStats.resetDailyStats();
}

function checkClamGettingFood() {
  // Detect collision between clam and kitchen food
  kitchen.cooked_food.forEach((food, index) => {
    if (detectCollision(clam, food)) {
      food.marked_for_deletion = true;
      console.log("clam collide w kitchen food");
      clam.bullets_held.push(new FoodSprite(clam.x_pos, clam.y_pos));
    }
  });
}

function initializeKitchen(kitchen) {
  // Start kitchen and begin cooking food
  if (kitchen.cooking === false) {
    var kitchenCooking = setInterval(cookFood, kitchen.cook_time);
    kitchen.cooking = true;
  }
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
      console.log("newfood pushed to kitchen");
    }

    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }
  }
}

function updateBullets(bullets, deltaTime) {
  //function to update bullets each loop
  bullets.forEach((bullet, index) => {
    customers.forEach((customer, index) => {
      if (detectOverlapCollision(bullet, customer)) {
        // if bullets are colliding:
        // drop coin if customer is done eating
        if (
          customer.hunger_points <= 0 &&
          customer.done_dropping_coin === false
        ) {
          dropCoin(customer, coins);
        }
        // trigger customer eating process if customer has not yet begun
        if (customer.hit === false) {
          custEatingFood(bullet, customer, coins);
        }
        // trigger food being eaten process if food has not yet
        if (bullet.food_hit === false) {
          foodBeingEaten(bullet, customer);
        }
      }
    });
    // Detect collision between bullet and clam
    if (detectCollision(bullet, clam) && bullet.pickupable === true) {
      clam.bullets_held.push(new FoodSprite(clam.x_pos, clam.y_pos));
      bullet.marked_for_deletion = true;
      console.log("clam collide w existing food");
    }

    bullet.update(deltaTime);
    bullet.draw(ctx);
  });
}

function dropCoin(customer, coins) {
  // Function to make customer drop coin
  coins.push(
    new Coin(
      customer.x_pos + customer.size / 2,
      customer.y_pos + customer.size / 2
    )
  );
  customer.done_dropping_coin = true;
}

function updateCustomers(customers, deltaTime) {
  // Updating and drawing customers each frame
  customers.forEach((customer, index) => {
    customer.update(deltaTime);
    customer.draw(ctx);
  });
  // reload customers array (temporary code, will flesh out cust gen)
  if (customers.length < 3) {
    customers.push(new Customer(GAME_HEIGHT, GAME_WIDTH));
  }
}

function custEatingFood(bullet, customer, coins) {
  // Actions for Customer to perform when they hit Food in game
  customer.hit = true;
  customer.hitFood(bullet);

  // Code to represent the customer "eating" the food
  var eatTime = setInterval(custEat, 750);
  function custEat() {
    const fill_points = 1;
    customer.hunger_points = customer.hunger_points - fill_points;

    if (customer.hunger_points <= 0) {
      clearInterval(eatTime);
      // accrue GameStats stats
      gameStats.days_fedcusts++;
    }
  }
}

function foodBeingEaten(bullet, customer) {
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

// ----------------------- RUN GAMELOOP -----------------------------
gameLoop();
