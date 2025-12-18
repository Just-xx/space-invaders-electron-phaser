import Bullet from "./BulletSprite";

class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene, direction = 'up', spread = false, bulletTexture = 'bullet') {
    super(scene.physics.world, scene);
    this.scene = scene;

    // properties
    this.shotPossible = true;
    this.cooldown = 500; // in ms

    // related to autoshooting
    this.direction = direction;
    this.spread = spread;
    this.bulletTexture = bulletTexture;

    this.classType = Bullet;
  }

  handleInput(player) {
    if (!this.scene.cursor.space.isDown || !this.shotPossible) return;

    const x = player.x + player.displayWidth / 2;
    const y = player.y;
    const bullet = this.get(x, y);

    if (bullet) {
      bullet.fire(x, y, this.direction, this.spread, this.bulletTexture);
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
        bullet.fire(x, y, this.direction, this.spread, this.bulletTexture);
      }
    }
  }
}

export default Bullets;
