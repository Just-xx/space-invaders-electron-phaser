import Phaser from "phaser";
import BulletsGroup from './BulletsGroup';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, boundsX) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.boundsX = this.scene.boundsX;

    this.playerSpeed = 500;
    this.PLAYER_SCALE = 0.13;
    this.PLAYER_MOVMENT_ANGLE = 5;

    this.#init();
  }

  #init() {
    this.body.setAllowGravity(false);
    this.setOrigin(0, 0);
    this.setScale(this.PLAYER_SCALE);
    this.cursor = this.scene.input.keyboard.createCursorKeys();

    this.bullets = new BulletsGroup(this.scene);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const { left, right } = this.cursor;

    if (left.isDown && this.x >= this.boundsX.left) {
      this.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.setAngle(-this.PLAYER_MOVMENT_ANGLE);
      this.setVelocityX(-this.playerSpeed);
      this.flipX = true;
    } else if (right.isDown && this.x <= this.boundsX.right - this.displayWidth) {
      this.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.setAngle(this.PLAYER_MOVMENT_ANGLE);
      this.setVelocityX(this.playerSpeed);
      this.flipX = false;
    } else {
      this.setAngle(0);
      this.setScale(this.PLAYER_SCALE);
      this.setVelocity(0);
    }

    this.bullets.handleInput(this);
  }
}

export default Player;
