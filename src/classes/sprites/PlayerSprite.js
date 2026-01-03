import * as Phaser from "phaser";
import BulletsGroup from "../groups/BulletsGroup";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.boundsX = this.scene.boundsX;

    this.playerSpeed = 1000;
    this.PLAYER_SCALE = 0.14;
    this.PLAYER_MOVMENT_ANGLE = 5;

    this.lives = 1;
    this.score = 0;
    this.inputsActive = true;

    this.body.setAllowGravity(false);
    this.setOrigin(0, 0);
    this.setScale(this.PLAYER_SCALE);
    this.cursor = this.scene.input.keyboard.createCursorKeys();

    this.bullets = new BulletsGroup(this.scene);
    this.createParticles();
  }

  createParticles() {
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

    this.thrustParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      frequency: 1,
      speed: {min: 450, max: 600},
      angle: {min: 80, max: 100},
      scale: {start: 0.08, end: 0},
      lifespan: {min: 50, max: 80},
      alpha: 0.3,
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xffe482, 0xffad3d, 0xff7a00],
      emitting: false,
    });

    this.stationaryParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      frequency: 20,
      speed: {min: 100, max: 200},
      angle: {min: 80, max: 100},
      scale: {start: 0.08, end: 0},
      lifespan: {min: 20, max: 40},
      alpha: 0.5,
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xffe482, 0xffad3d, 0xff7a00],
      emitting: false,
    });

    this.thrustParticles.startFollow(this, this.displayWidth / 2, this.displayHeight + 15);
    this.stationaryParticles.startFollow(this, this.displayWidth / 2, this.displayHeight + 15);
  }

  setStationary() {
    this.setAngle(0);
    this.setScale(this.PLAYER_SCALE);
    this.setVelocity(0);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.lives <= 0 || !this.inputsActive || this.scene.disableProgress) {
      this.thrustParticles.stop();
      this.stationaryParticles.stop();
      return this.setStationary();
    }

    const {left, right} = this.cursor;

    if (left.isDown && this.x >= this.boundsX.left) {
      this.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.setAngle(-this.PLAYER_MOVMENT_ANGLE);
      this.setVelocityX(-this.playerSpeed);
      this.flipX = true;

      this.stationaryParticles.stop();
      this.thrustParticles.start();
    } else if (right.isDown && this.x <= this.boundsX.right - this.displayWidth) {
      this.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.setAngle(this.PLAYER_MOVMENT_ANGLE);
      this.setVelocityX(this.playerSpeed);
      this.flipX = false;

      this.stationaryParticles.stop();
      this.thrustParticles.start();
    } else {
      this.setStationary();

      this.thrustParticles.stop();
      this.stationaryParticles.start();
    }

    this.bullets.handleInput(this);
  }

  addScore(amount = 20) {
    this.score += amount;
  }

  gameOver() {
    this.lives = 0;
    this.inputsActive = false;
    this.setImmovable(true);
    this.#destroyEffect();
    this.thrustParticles.stop();
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
