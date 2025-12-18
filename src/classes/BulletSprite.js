import Phaser from "phaser";

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;

    // properties
    this.velocity = 500;
    this.spread = 400;
  }

  #init() {
    this.setScale(0.06);
    this.body.allowGravity = false;
    this.depth = -1;
  }

  fire(x, y, direction = 'up', spread = false, texture = 'bullet') {
    this.setTexture(texture);
    this.#init();
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(direction === 'up' ? -this.velocity : this.velocity);
    if (spread) {
      this.setVelocityX((Math.random() - 0.5) * this.spread);
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= 0 || this.y > this.scene.sys.game.config.height) {
      this.disableBody(true, true);
    }
  }
}

export default Bullet;
