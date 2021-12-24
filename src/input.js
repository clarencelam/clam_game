import { spacebarTrigger } from "/src/index";

export default class InputHandler {
  constructor(clam, canvas) {
    this.canvas = canvas;
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
          spacebarTrigger();
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
    // click listener
    document.addEventListener("click", (event) => {
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      console.log("clickX: " + x + "clickY: " + y);
    });
  }
}
