import Clam from "/src/clam";
import InputHandler from "/src/input";
import Food from "/src/food";
import Customer from "/src/customer";
import Coin from "/src/coin";
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
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
let background = document.getElementById("background");

let clam = new Clam(GAME_WIDTH, GAME_HEIGHT);
let bullets = [];
let coins = [];
let customers = [];
let lastTime = 0;

new InputHandler(clam);

// --------------- MAIN GAMELOOP --------------------------
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.drawImage(background, 0, 0, 1200, 800);

  //update and draw coin objects
  coins = coins.filter((coin) => !coin.marked_for_deletion);

  coins.forEach((coin, index) => {
    coin.update();
    coin.draw(ctx);
  });

  // update and draw customer objects
  customers = customers.filter((customer) => !customer.markfordelete);
  updateCustomers(customers, deltaTime);

  // update and draw bullets
  bullets = bullets.filter((bullet) => !bullet.marked_for_deletion);
  updateBullets(bullets, deltaTime);

  clam.update(deltaTime);
  clam.draw(ctx);

  requestAnimationFrame(gameLoop);
}

// ----------------- HELPER FUNCTIONS --------------------------
export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fireBullet() {
  bullets.push(new Food(clam.x_pos, clam.y_pos, clam.facing));
}

function updateBullets(bullets, deltaTime) {
  bullets.forEach((bullet, index) => {
    customers.forEach((customer, index) => {
      // checks if the food is done colliding (needs to get into range)
      if (detectOverlapCollision(bullet, customer)) {
        if (customer.hunger_points <= 0 && customer.dropped_coin === false) {
          coins.push(new Coin(customer.x_pos, customer.y_pos));
          customer.dropped_coin = true;
        }
        // Trigger eating actions
        if (customer.hit === false) {
          custEatingFood(bullet, customer, coins);
        }
        if (bullet.food_hit === false) {
          foodBeingEaten(bullet, customer);
        }
      }
    });
    bullet.update(deltaTime);
    bullet.draw(ctx);
  });
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
  console.log("customer_hit");
  customer.hit = true;
  customer.hitFood(bullet);

  // Code to represent the customer "eating" the food
  var eatTime = setInterval(custEat, 750);
  function custEat() {
    const fill_points = 1;
    customer.hunger_points = customer.hunger_points - fill_points;
    console.log(customer.hunger_points);

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
