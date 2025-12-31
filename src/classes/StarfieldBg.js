class StarfiledBg {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.createStarfield();
  }

  static createStarfieldTexture(gameScene) {
    if (gameScene.bgFront) return;

    const rt = gameScene.make.graphics({x: 0, y: 0, add: false});

    rt.fillStyle(0x000000, 0);
    rt.fillRect(0, 0, gameScene.scale.width, gameScene.scale.height);

    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, gameScene.scale.width);
      const y = Phaser.Math.Between(0, gameScene.scale.height);
      const size = Phaser.Math.FloatBetween(0.5, 2.5);
      const alpha = Phaser.Math.FloatBetween(0.5, 1);

      rt.fillStyle(0xffffff, alpha);
      rt.fillPoint(x, y, size);
    }

    rt.generateTexture("starfield", gameScene.scale.width, gameScene.scale.height);
  }

  createStarfield() {
    const {width, height} = this.gameScene.scale;

    this.gameScene.bgBack = this.gameScene.add.tileSprite(0, 0, width, height, "starfield").setOrigin(0, 0).setDepth(-10).setAlpha(0.4);
    this.gameScene.bgFront = this.gameScene.add.tileSprite(0, 0, width, height, "starfield").setOrigin(0, 0).setDepth(-5).setAlpha(0.6);

    this.gameScene.scale.on("resize", size => {
      this.gameScene.bgBack.setSize(size.width, size.height);
      this.gameScene.bgFront.setSize(size.width, size.height);
    });
  }

  update(time, delta) {
    const speed = 0.02;
    this.gameScene.bgBack.tilePositionY -= speed * delta;
    this.gameScene.bgFront.tilePositionY -= speed * 3 * delta;
  }
}


export default StarfiledBg;