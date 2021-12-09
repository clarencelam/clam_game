import { fireBullet } from "/src/index";

export default class InputHandler {
  constructor(clam) {
    document.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 37:
          clam.moving_left = true;
          break;
        case 39:
          clam.moving_right = true;
          break;
        case 38:
          clam.moving_up = true;
          break;
        case 40:
          clam.moving_down = true;
          break;
        case 32:
          // Shoot a bullet
          fireBullet();
          clam.shooting = true;
          break;
        default:
          console.log("Error - keydown not recognized");
      }
    });
    document.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 37:
          clam.moving_left = false;
          break;
        case 39:
          clam.moving_right = false;
          break;
        case 38:
          clam.moving_up = false;
          break;
        case 40:
          clam.moving_down = false;
          break;
        case 32:
          clam.shooting = false;
          break;
        default:
          console.log("Error - keyup not recognized");
      }
    });
  }
}
