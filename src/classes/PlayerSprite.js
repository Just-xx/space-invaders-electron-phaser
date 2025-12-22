import Phaser from "phaser";
import BulletsGroup from "./BulletsGroup";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.boundsX = this.scene.boundsX;

    this.playerSpeed = 500;
    this.PLAYER_SCALE = 0.13;
    this.PLAYER_MOVMENT_ANGLE = 5;

    this.lives = 3;
    this.score = 0;
    this.inputsActive = true;

    this.body.setAllowGravity(false);
    this.setOrigin(0, 0);
    this.setScale(this.PLAYER_SCALE);
    this.cursor = this.scene.input.keyboard.createCursorKeys();

    this.bullets = new BulletsGroup(this.scene);

    this.destroyParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 150, max: 350},
      angle: {min: 0, max: 360},
      scale: {start: 0.2, end: 0},
      lifespan: {min: 200, max: 500},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0x80ecff, 0x389deb, 0xf9180ff],
      emitting: false,
    });

    this.hitParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 150, max: 350},
      angle: {min: 0, max: 360},
      scale: {start: 0.05, end: 0},
      lifespan: {min: 100, max: 300},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0x80ecff, 0x389deb, 0xf9180ff],
      emitting: false,
    });
  }

  setStationary() {
    this.setAngle(0);
    this.setScale(this.PLAYER_SCALE);
    this.setVelocity(0);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.lives <= 0 || !this.inputsActive) return this.setStationary();

    const {left, right} = this.cursor;

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
    } else this.setStationary();

    this.bullets.handleInput(this);
  }

  addScore() {
    this.score += 20;
  }

  gameOver() {
    this.lives = 0;
    this.inputsActive = false;
    this.setImmovable(true);
    this.#destroyEffect();
  }

  #respawnEffect(bullet) {
    this.inputsActive = false;

    this.hitParticles.explode(5, bullet.x + bullet.displayWidth / 2, bullet.y + bullet.displayHeight / 2);

    this.scene.tweens.add({
      targets: this,
      alpha: {from: 0.2, to: 1},
      duration: 200,
      ease: "Linear",
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.alpha = 1;
        this.inputsActive = true;
      },
    });
  }

  #destroyEffect() {
    this.inputsActive = false;
    this.destroyParticles.explode(60, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 150,
      ease: "EaseIn",
    });
  }

  onHit(bullet) {
    if (!this.inputsActive) return;
    this.lives--;

    if (this.lives <= 0) this.gameOver();
    else this.#respawnEffect(bullet);
  }
}

export default Player;
