import EnemySprite from "../sprites/EnemySprite";
import BulletsGroup from "./BulletsGroup";

class EnemiesGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene, level) {
    super(scene.physics.world, scene);
    this.scene = scene;

    this.spacingX = 32;
    this.spacingY = 16;

    this.startX = this.scene.boundsX.left;
    this.startY = this.scene.boundsY.top;

    this.shootChance = level.shootChance;
    this.startVelocity = level.speed || 100;
    this.velocity = this.startVelocity;
    this.levelScheme = level.scheme;
    this.depthLevel = 0;
    this.lastVelocity = this.startVelocity;
    this.canShoot = false;

    this.bullets = new BulletsGroup(this.scene, "down", true, "bullet-type1");

    this.createEnemies();

    this.timeToStop = 500;
    this.timeToAnimate = 500;
    this.stareTime = 500;

    this.fastInv1Sound = this.scene.sound.add('fast-inv1');
    this.fastInv2Sound = this.scene.sound.add('fast-inv2');
    this.fastInv3Sound = this.scene.sound.add('fast-inv3');
    this.fastInv4Sound = this.scene.sound.add('fast-inv4');

    this.musicState = 1;
    this.musicSpeed = this.startVelocity;
    this.timeToPlayNote = 0;
  }

  playSong(time, delta) {
    if (this.scene.disableProgress) return;

    this.musicSpeed = this.velocity;

    this.timeToPlayNote -= delta;
    if (this.timeToPlayNote > 0 ) return;

    switch(this.musicState) {
      case 1: this.fastInv1Sound.play({ volume: this.scene.volume.effects * 10 }); break;
      case 2: this.fastInv2Sound.play({ volume: this.scene.volume.effects * 10 }); break;
      case 3: this.fastInv3Sound.play({ volume: this.scene.volume.effects * 10 }); break;
      case 4: this.fastInv4Sound.play({ volume: this.scene.volume.effects * 10 }); break;
    }

    this.getChildren().forEach(e => e.flip())

    this.timeToPlayNote = 90000 / this.velocity;
    this.musicState++;
    if (this.musicState > 4) this.musicState = 1;
  }

  update(time, delta) {
    this.playSong(time, delta);
    this.handleBoundsCollsion();
    if (this.canShoot && this.getChildren().length) this.autoShooting();

    // stop if progress is disabled
    if (!this.getChildren().length) return;
    const enemiesVelocity = this.getChildren()[0].body.velocity.x;

    if (this.scene.disableProgress && enemiesVelocity !== 0) {
      this.lastVelocity = enemiesVelocity;
      this.getChildren().forEach(e => e.setVelocityX(0));
      this.canShoot = false;
    }

    // resume if progress is enabled again
    if (!this.scene.disableProgress && enemiesVelocity === 0) {
      this.getChildren().forEach(e => e.setVelocityX(this.lastVelocity));
      this.canShoot = true;
    }
  }

  handleBoundsCollsion() {
    this.getChildren().forEach(child => {
      if (child.x + child.displayWidth >= this.scene.boundsX.right && child.body.velocity.x > 0) {
        this.setVelocityX(-this.velocity);
        this.moveDown();
      } else if (child.x <= this.scene.boundsX.left && child.body.velocity.x < 0) {
        this.setVelocityX(this.velocity);
        this.moveDown();
      }
    });
  }

  moveDown() {
    if (this.scene.disableProgress) return;
    this.depthLevel++;

    this.getChildren().forEach(child => {
      const newY = child.y + this.lastEnemyDisplayHeight + this.spacingY;
      this.scene.tweens.add({
        targets: child,
        y: newY,
        x: child.x,
        duration: 80,
        ease: "Power2",
      });
    });
    this.velocity += 15;
  }

  autoShooting() {
    const childs = this.getChildren();
    const randomEnemyIndex = Phaser.Math.Between(0, childs.length - 1);
    const chance = this.shootChance;
    this.bullets.handleEnemyFire(childs[randomEnemyIndex], chance);
  }

  gameOver() {
    this.canShoot = false;
    this.scene.disableProgress = true;
  }

  speedup() {
    if (this.getChildren().length <= 0) return;
    const enemyVelocity = this.getChildren()[0].body.velocity.x;
    this.velocity += 5;

    if (enemyVelocity < 0) this.setVelocityX(-this.velocity);
    else this.setVelocityX(this.velocity);
  }

  createEnemies() {
    this.lastEnemyY = 0;
    this.lastEnemyX = 0;

    this.lastEnemyDisplayWidth = 0;
    this.lastEnemyDisplayHeight = 0;

    this.lastRowMaxY = 0; // includes enemie's height

    for (let i = 0; i < this.levelScheme.length; i++) {
      for (let j = 0; j < this.levelScheme[i].length; j++) {
        this.addEnemy(this.levelScheme[i][j], i, j);
      }
    }

    this.centerEnemies();
  }

  addEnemy(enemyInfo, i, j) {
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

  centerEnemies() {
    
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

  destroy() {
    this.fastInv1Sound.destroy();
    this.fastInv2Sound.destroy();
    this.fastInv3Sound.destroy();
    this.fastInv4Sound.destroy();
    super.destroy()
  }
}

export default EnemiesGroup;
