import EnemySprite from "./EnemySprite";
import BulletsGroup from "./BulletsGroup";
import { ENEMIES_SCHEME_LVL1 } from '../constants/ENEMIES_SCHEMES'

class EnemiesGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, scheme, startVelocity) {
    super(scene.physics.world, scene);
    this.scene = scene;

    this.spacingX = 32;
    this.spacingY = 16;

    this.startX = this.scene.boundsX.left;
    this.startY = this.scene.boundsY.top;

    this.startVelocity = startVelocity || 100;
    this.levelScheme = scheme || ENEMIES_SCHEME_LVL1;
    this.depthLevel = 0;

    this.bullets = new BulletsGroup(this.scene, "down", true, "bullet-type1");
    this.canShoot = true;

    this.createEnemies();
  }

  update() {
    this.#handleBoundsCollsion();
    if (this.canShoot && this.getChildren().length) this.autoShooting();
  }

  createEnemies() {
    this.lastEnemyY = 0;
    this.lastEnemyX = 0;

    this.lastEnemyDisplayWidth = 0;
    this.lastEnemyDisplayHeight = 0;

    this.lastRowMaxY = 0; // includes enemie's height

    for (let i = 0; i < this.levelScheme.length; i++) {
      for (let j = 0; j < this.levelScheme[i].length; j++) {
        this.#addEnemy(this.levelScheme[i][j], i, j);
      }
    }

    this.#centerEnemies();
  }

  #addEnemy(enemyInfo, i, j) {

    const type = enemyInfo[0];
    const health = enemyInfo[1];
    const shootingChance = enemyInfo[2] || 150;

    let x = this.startX;
    let y = this.startY;

    // first enemies of every row excluding first row
    if (j === 0 && i !== 0) {
      y = this.lastRowMaxY + this.spacingY;
    }
    // every other enemy excluding first in first row
    else if (j !== 0) {
      x = this.lastEnemyDisplayWidth + this.lastEnemyX + this.spacingX;
      y = this.lastEnemyY;
    }

    const enemy = new EnemySprite(this.scene, x, y, type, health, shootingChance);

    this.lastEnemyDisplayWidth = enemy.displayWidth;
    this.lastEnemyDisplayHeight = enemy.displayHeight;

    this.lastEnemyX = enemy.x;
    this.lastEnemyY = enemy.y;

    if (y + enemy.displayHeight > this.lastRowMaxY) this.lastRowMaxY = y + enemy.displayHeight;

    this.add(enemy);
    enemy.body.allowGravity = false;

    enemy.setVelocityX(this.startVelocity);
  }

  #centerEnemies() {
    // spaghetti code
    let xBound = 0;

    const enemies = this.getChildren();

    enemies.forEach(e => {
      if (e.x + e.displayWidth > xBound) xBound = e.x + e.displayWidth;
    });

    let row = 0;
    let column = 0;

    let enemiesRow = [];
    let enemiesStructure = [];

    enemies.forEach((e, i) => {
      enemiesRow.push(e);
      column++;

      if (column === this.levelScheme[row].length) {
        enemiesStructure.push(enemiesRow);
        enemiesRow = [];
        column = 0;
        row++;
      }
    });

    enemiesStructure.forEach(eRow => {
      const lastEnemyInRow = eRow.at(-1);
      const lastsEnemyMaxX = lastEnemyInRow.x + lastEnemyInRow.displayWidth;

      if (lastsEnemyMaxX < xBound) {
        const diff = (xBound - lastsEnemyMaxX) / 2;
        eRow.forEach(e => (e.x = e.x + diff));
      }
    });
  }

  #handleBoundsCollsion() {
    this.getChildren().forEach(child => {
      if (child.x + child.displayWidth >= this.scene.boundsX.right && child.body.velocity.x > 0) {
        this.setVelocityX(-this.startVelocity);
        this.#moveDown();
      } else if (child.x <= this.scene.boundsX.left && child.body.velocity.x < 0) {
        this.setVelocityX(this.startVelocity);
        this.#moveDown();
      }
    });
  }

  #moveDown() {
    if (this.scene.disableProgress) return;
    this.depthLevel++;

    this.getChildren().forEach(child => {
      child.y += this.lastEnemyDisplayHeight + this.spacingY;
    });
    this.velocity += 20;
  }

  autoShooting() {
    const childs = this.getChildren();
    const randomEnemyIndex = Phaser.Math.Between(0, childs.length - 1);
    const chance = childs[randomEnemyIndex].shootingChance;
    this.bullets.handleEnemyFire(childs[randomEnemyIndex], chance);
  }

  gameOver() {
    this.canShoot = false;
    this.scene.disableProgress = true;
  }
}

export default EnemiesGroup;
