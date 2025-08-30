export class Controls {
  constructor() {
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    window.addEventListener("keydown", (e) => {
      if (e.key in this.keys) this.keys[e.key] = true;
      e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      if (e.key in this.keys) this.keys[e.key] = false;
      e.preventDefault();
    });
  }
}
