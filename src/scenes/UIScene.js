import {Scene} from "phaser";

export default class UIScene extends Scene {
  constructor() {
    super({key: "scene-ui", active: true});

    this.score = 0;
    this.maxScore = 0;
    this.lives = 3;
    this.level = 0;

    this.elementsSpacing = 256;
  }

  preload() {}

  create() {
    const gameScene = this.scene.get("scene-game");

    const centerX = this.scale.width / 2;
    const centerTopBarY = gameScene.boundsY.top / 2;

    this.scoreText = this.add.text(centerX, centerTopBarY, `Wynik: ${this.score}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });

    this.scoreText.setOrigin(0.5, 0.5);

    this.livesText = this.add.text(centerX - this.elementsSpacing, centerTopBarY, `Życia: ${this.lives}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });

    this.livesText.setOrigin(0.5, 0.5);

    this.levelText = this.add.text(centerX + this.elementsSpacing, centerTopBarY, `Poziom: ${this.level}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });

    this.levelText.setOrigin(0.5, 0.5);

    gameScene.events.on("updateUI", data => {
      this.score = data.score;
      this.lives = data.lives;
      this.level = data.level;

      this.scoreText.setText(`Wynik: ${this.score}`);
      this.livesText.setText(`Życia: ${this.lives}`);
      this.levelText.setText(`Poziom: ${this.level}`);

      if (this.lives <= 0) this.gameOver();
    });
  }

  gameOver() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.gameOverText = this.add.text(centerX, centerY, "Koniec gry", {
      font: "600 42px Orbitron",
      fill: "#e3e3e3"
    })
    this.gameOverText.setOrigin(0.5, 0.5);
  }
}
