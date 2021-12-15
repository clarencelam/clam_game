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
  eatFood
} from "/src/gameMechanics";

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
let customers = [];
let lastTime = 0;
let gameStats = new GameStats();
let kitchen = new Kitchen(GAME_HEIGHT, GAME_WIDTH);

new InputHandler(clam);

// --------------- MAIN GAMELOOP --------------------------
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  //  console.log(timestamp);

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  //ctx.drawImage(background, 0, 0, 1200, 800);

  // Perform the kitchen cooking loop
  initializeKitchen(kitchen);
  kitchen.draw(ctx);

  //update and draw coin objects
  coins = coins.filter((coin) => !coin.marked_for_deletion);

  coins.forEach((coin, index) => {
    if (detectCollision(coin, clam)) {
      coin.marked_for_deletion = true;
      gameStats.dollars = gameStats.dollars + coin.value;
    }
    coin.draw(ctx);
  });

  // update and draw customer objects
  customers = customers.filter((customer) => !customer.markfordelete);
  updateCustomers(customers, deltaTime);

  // update and draw bullets
  bullets = bullets.filter((bullet) => !bullet.marked_for_deletion);
  updateBullets(bullets, deltaTime);

  // update and draw game score, lives, other stats
  gameStats.draw(ctx);

  // update and draw clam character
  clam.update(deltaTime);
  checkClamInKitchen();
  clam.draw(ctx);

  requestAnimationFrame(gameLoop);
}

// ----------------- HELPER FUNCTIONS --------------------------
export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function spacebarTrigger() {
  // Perform activites for when spacebar is pressed
  if (clam.inKitchenZone === true) {
    // collect bullets from kitchen
    for (let i = 1; i <= kitchen.cooked_food; i += 1) {
      clam.bullets_held.push(new FoodSprite(clam.x_pos, clam.y_pos));
    }
    kitchen.cooked_food = 0;
  } else {
    // if clam bullet length > 0, fire bullet
    if (clam.bullets_held.length > 0) {
      bullets.push(new Food(clam.x_pos, clam.y_pos, clam.facing));
      clam.bullets_held.shift(); // removes last item in array
    }
  }
}

function checkClamInKitchen() {
  // check if clam is in kitchen area
  if (detectCollision(kitchen, clam)) {
    clam.inKitchenZone = true;
    console.log("clam in kitchen");
  } else {
    clam.inKitchenZone = false;
  }
}

function initializeKitchen(kitchen) {
  if (kitchen.cooking === false) {
    var kitchenCooking = setInterval(cookFood, kitchen.cook_time);
    kitchen.cooking = true;
  }
  function cookFood() {
    // Cook a food bullet into the kitchen if space is available
    if (kitchen.cooked_food < kitchen.max_food) {
      kitchen.cooked_food += 1;
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
