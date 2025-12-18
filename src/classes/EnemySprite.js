import BulletsGroup from "./BulletsGroup";

const ENEMY_TYPES = [
  'enemy-type0',
  'enemy-type1',
  'enemy-type2',
  'enemy-type3',
  'enemy-type4',
  'enemy-type5',
  'enemy-type6',
]

const ENEMIES_SCALES = [
  0.1,
  0.09,
  0.14,
  0.1,
  0.19,
  0.23,
  0.19
]

class EnemySprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemyType, health = 100, shootingChance = 100) {
    super(scene, x, y, ENEMY_TYPES[enemyType]);
    this.scene = scene;

    this.enemyType = enemyType;
    this.maxHealth = health;
    this.health = this.maxHealth;
    this.healthBarActive = false;

    this.shootingChance = shootingChance;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.healthBar = this.scene.add.graphics();
    this.healthBar.setVisible(false);

    this.flipTime = 1000;

    this.#init();
  }

  #init() {
    this.body.allowGravity = false;
    this.setOrigin(0, 0);
    this.setScale(ENEMIES_SCALES[this.enemyType]);
  }

  #updateHealthBar() {
    if (!this.healthBarActive) {
        this.healthBarActive = true;
        this.healthBar.setVisible(true);
    }

    this.healthBar.clear();

    const width = this.displayWidth;
    const height = 6;

    // BG
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(0, -height - 2, width, 6);

    // Health
    const healthPercentage = this.health / this.maxHealth;
    const healthBarColor = healthPercentage > 0.6 ? 0x00ff00 : healthPercentage > 0.3 ? 0xffff00 : 0xff0000;
    
    this.healthBar.fillStyle(healthBarColor, 1);
    this.healthBar.fillRect(0, -height - 2, width * healthPercentage, 6);
  }

  onHit(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }

    this.#updateHealthBar();

    if (this.health === 0) {
      this.scene.time.delayedCall(100, () => {
        this.destroy();
      });
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.healthBarActive) {
      this.healthBar.setPosition(this.x, this.y);
    }

    if (this.flipTime <= 0) {
      this.flipX = !this.flipX
      this.flipTime = 1000;
    }

    this.flipTime -= delta;

  }

  destroy(fromScene) {
    this.healthBar.destroy();
    super.destroy(fromScene);
  }
}

export default EnemySprite;