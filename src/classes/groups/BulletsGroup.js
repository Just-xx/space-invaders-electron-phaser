import Bullet from "../sprites/BulletSprite";

class BulletsGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;

    // properties for player shots
    this.shotPossible = true;
    this.cooldown = 0; // in ms

    this.classType = Bullet;
  }

  handleInput(player) {
    if (!this.scene.cursor.space.isDown || !this.shotPossible) return;

    const x = player.x + player.displayWidth / 2;
    const y = player.y;
    const bullet = this.get(x, y);

    if (bullet) {
      bullet.fire(x, y);
    }

    this.shotPossible = false;

    setTimeout(() => (this.shotPossible = true), this.cooldown);
  }

  handleEnemyFire(enemy, chance) {
    if (Phaser.Math.Between(0, chance) === 0) {
      const x = enemy.x;
      const y = enemy.y + enemy.displayHeight / 2;
      const bullet = this.get(x, y);

      if (bullet) {
        bullet.enemyFire(x, y);
      }
    }
  }
}

export default BulletsGroup;
