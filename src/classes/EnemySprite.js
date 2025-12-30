const ENEMY_TYPES = [
  "enemy-type0",
  "enemy-type1",
  "enemy-type2",
  "enemy-type3",
  "enemy-type4",
  "enemy-type5",
  "enemy-type6",
];

const ENEMIES_SCALES = [0.1, 0.09, 0.14, 0.1, 0.19, 0.23, 0.19];

class EnemySprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemyType, health = 100) {
    super(scene, x, y, ENEMY_TYPES[enemyType]);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    // properties
    this.enemyType = enemyType;
    this.maxHealth = health;
    this.health = this.maxHealth;
    this.healthBarActive = false;

    this.flipTime = 1000;
    this.timeToFlip = this.flipTime;

    this.body.allowGravity = false;
    this.setOrigin(0, 0);
    this.setScale(ENEMIES_SCALES[this.enemyType]);

    this.healthBar = this.scene.add.graphics();
    this.healthBar.setVisible(false);

    this.particles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 100, max: 300},
      angle: {min: 0, max: 360},
      scale: {start: 0.1, end: 0},
      lifespan: {min: 200, max: 500},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00],
      emitting: false,
    });
  }

  #updateHealthBar() {
    // activate when health below max value
    if (!this.healthBarActive) {
      this.healthBarActive = true;
      this.healthBar.setVisible(true);
    }

    this.healthBar.clear();

    // healthbar bg
    const width = this.displayWidth;
    const height = 6;

    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(0, -height - 2, width, height);

    // healthabr value
    const healthPercentage = this.health / this.maxHealth;
    const healthBarColor = healthPercentage > 0.6 ? 0x00ff00 : healthPercentage > 0.3 ? 0xffff00 : 0xff0000;

    this.healthBar.fillStyle(healthBarColor, 1);
    this.healthBar.fillRect(0, -height - 2, width * healthPercentage, height);
  }

  onHit(damage) {
    if (this.health <= 0) return;

    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }

    this.#updateHealthBar();

    if (this.health === 0) {
      this.particles.explode(20, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);
      this.scene.time.delayedCall(100, () => this.destroy());
      return true;
    }

    return false;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.healthBarActive) {
      this.healthBar.setPosition(this.x, this.y);
    }

    if (this.timeToFlip <= 0) {
      this.flipX = !this.flipX;
      this.timeToFlip = this.flipTime;
    }

    this.timeToFlip -= delta;
  }

  destroy(fromScene) {
    this.healthBar.destroy();
    super.destroy(fromScene);
  }
}

export default EnemySprite;
