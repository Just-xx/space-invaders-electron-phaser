import Phaser from "phaser";
import BulletsGroup from "../groups/BulletsGroup";

class UfoSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ufo");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    this.setScale(0.13);
    this.body.allowGravity = false;

    this.x = -100;
    this.y = -100;

    this.inProgress = false;
    this.setVisible(false);
    this.lastDepth = -1;

    this.bullets = new BulletsGroup(this.scene);

    this.destroyParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 100, max: 300},
      angle: {min: 0, max: 360},
      scale: {start: 0.1, end: 0},
      lifespan: {min: 200, max: 500},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00],
      emitting: false,
    });

    this.trailEmitter = this.scene.add.particles(0, 0, "blob", {
      speed: 0,
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.2, end: 0 },
      lifespan: 250,
      blendMode: "ADD",
      emitting: false
    });

    this.deployCount = 0;
  }

  start(direction) {
    if (this.scene.enemies.getLength() <= 0) return;
    this.deployCount++;
    this.inProgress = true;
    this.setVisible(true);

    const firstEnemie = this.scene.enemies.getChildren()[0];
    const startY = firstEnemie.y - firstEnemie.displayHeight * 3;

    let vectorA = new Phaser.Math.Vector2(-this.displayWidth, startY);
    let vectorB = new Phaser.Math.Vector2(this.scene.scale.width + this.displayWidth, startY);
    const vectorCenter = new Phaser.Math.Vector2(
      this.scene.scale.width / 2,
      2 * firstEnemie.y - startY - this.displayHeight * 2
    );

    this.trailEmitter.start();
    this.trailEmitter.startFollow(this);

    // direction = 1 / left
    if (!direction) {
      const temp = vectorA;
      vectorA = vectorB;
      vectorB = temp;
    }

    const duration = Math.round(Math.random() * 2000 + 6000);

    const path = new Phaser.Curves.QuadraticBezier(vectorA, vectorCenter, vectorB);

    this.animation = this.scene.tweens.add({
      targets: {t: 0},
      t: 1,
      duration,
      onUpdate: (tween, target) => {
        const position = path.getPoint(target.t);
        this.setPosition(position.x, position.y);
      },
      onComplete: () => {
        this.inProgress = false;
        this.setVisible(false);
        this.setPosition(-100, -100);
        this.trailEmitter.stop();
      },
    });
  }

  drawPath(path) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3);
    path.draw(graphics);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.scene.enemies.getLength() <= 0) return;

    if (this.checkStartCondition()) {
      this.inProgress = true;
      const timeToStart = Math.round(Math.random() * 1500 + 1000);
      this.scene.time.delayedCall(timeToStart, () => this.start(Math.round(Math.random())));
    }

    if (this.inProgress && this.visible && this.x > this.scene.boundsX.left + 128 && this.x < this.scene.boundsX.right - 128) {
      this.bullets.handleEnemyFire(this, (3 / this.scene.levelController.currentLevel) * 100);
    }
  }

  checkStartCondition() {
    if (this.inProgress) return false;
    

    const depth = this.scene.enemies.depthLevel;
    const level = this.scene.levelController.currentLevel;

    if (depth === this.lastDepth || depth === 0) return false;
    this.lastDepth = depth;

    if (depth === 5 && this.deployCount === 0) return true;

    const minChance = 0.1;
    const maxChance = 0.3;
    const maxLevel = 15;

    const safeLevel = Phaser.Math.Clamp(level, 1, maxLevel);
    const t = (safeLevel - 1) / (maxLevel - 1);
    const actualChance = minChance + t * (maxChance - minChance);

    const limit = Math.round(actualChance * Phaser.Math.Clamp(level, 10, maxLevel));
    if (limit <= this.deployCount) return false;

    return Math.random() <= actualChance;
  }

  onHit() {
    this.animation.stop();
    this.destroyParticles.explode(20, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);
    this.scene.time.delayedCall(100, () => {
      this.setVisible(false);
      this.setPosition(-100, -100);
      this.inProgress = false;
    });
  }
}

export default UfoSprite;
