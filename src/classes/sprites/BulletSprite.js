import * as Phaser from "phaser";

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;

    // properties
    this.velocity = 600;
    this.spread = 400;

    this.shootSound = this.scene.sound.add("shoot");

    // Create a trail emitter for each bullet instance
    this.trailEmitter = this.scene.add.particles(0, 0, "bullet", {
      speed: 10,
      scale: {start: 0.05, end: 0},
      alpha: {start: 0.7, end: 0},
      lifespan: 250,
      blendMode: "ADD",
      tint: 0xffffff,
      emitting: true,
    });

    this.enemyTrailEmitter = this.scene.add.particles(0, 0, "bullet", {
      speed: 10,
      scale: {start: 0.05, end: 0},
      alpha: {start: 0.7, end: 0},
      lifespan: 250,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00],
      emitting: true,
    });
  }

  #init() {
    this.setScale(0.06);
    this.body.allowGravity = false;
    this.depth = -1;
  }

  fire(x, y) {
    this.#init();

    this.enableBody(true, x, y, true, true);
    this.setVelocityY(-this.velocity);

    this.trailEmitter.start();
    this.trailEmitter.startFollow(this);

    this.shootSound.play({volume: this.scene.volume.effects});
  }

  enemyFire(x, y) {
    this.setTexture("bullet-type1");
    this.#init();

    this.enableBody(true, x, y, true, true);
    this.setVelocityX((Math.random() - 0.5) * this.spread);
    this.setVelocityY(this.velocity);

    this.enemyTrailEmitter.start();
    this.enemyTrailEmitter.startFollow(this);

    this.shootSound.play({volume: this.scene.volume.effects / 2, detune: 500});
  }

  onHit() {
    this.trailEmitter.stop();
    this.enemyTrailEmitter.stop();
    this.disableBody(true, true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y <= 0 || this.y > this.scene.sys.game.config.height) this.onHit();
  }
}

export default Bullet;
