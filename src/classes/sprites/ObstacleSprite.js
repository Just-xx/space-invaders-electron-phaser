class ObstacleSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "obstacle-part");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.allowGravity = false;
    this.setScale(0.7);

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

    this.hitSound = this.scene.sound.add('inv-killed').setDetune(2500);
  }

  onHit() {
    this.hitParticles.explode(5, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);
    this.hitSound.play({ volume: this.scene.volume.effects / 2 })
    this.destroy();
  }
}

export default ObstacleSprite;
