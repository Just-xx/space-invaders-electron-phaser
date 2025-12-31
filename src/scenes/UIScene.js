import {RIGHT, Scene} from "phaser";
import btnUrl from "../assets/game/btn_var_0.png";
import GameOverNode from "../classes/GameOverNode";
import LevelCompleteNode from "../classes/LevelCompleteNode";

class UIScene extends Scene {
  constructor() {
    super({key: "scene-ui", active: true});

    this.score = 0;
    this.maxScore = 0;
    this.lives = 3;
    this.level = 0;

    this.mainMenu = null;

    this.elementsSpacing = 256;
  }

  init(mainMenu) {
    this.mainMenu = mainMenu;
  }

  preload() {
    this.load.image("restart-btn", btnUrl);
  }

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
      const prevLvl = this.level || 1;

      this.score = data.score;
      this.lives = data.lives;
      this.level = data.level;

      this.scoreText.setText(`Wynik: ${this.score}`);
      this.livesText.setText(`Życia: ${this.lives}`);
      this.levelText.setText(`Poziom: ${this.level}`);

      if (this.lives <= 0) this.gameOver();
      if (prevLvl < data.level) this.levelComplete();
    });

    // game over screen handling
    this.gameOverNode = new GameOverNode();

    this.gameOverNode.onRestart(() => {
      this.gameOverNode.hide();
      this.events.emit("restart");
    });

    this.gameOverNode.onReturn(() => this.onReturn());

    // level complete screen
    this.levelCompleteNode = new LevelCompleteNode();

    this.levelCompleteNode.onNextLevelClick(() => {
      this.levelCompleteNode.hide();
      this.events.emit("nextLevelStart");
    });

    this.levelCompleteNode.onReturn(() => this.onReturn());
  }

  fadeIn() {
    this.tweens.add({
      targets: [this.scoreText, this.levelText, this.livesText],
      alpha: {from: 0, to: 1},
      duration: 2400,
      ease: "EaseIn",
    });
  }

  gameOver() {
    this.gameOverNode.setLevel(this.level);
    this.gameOverNode.setScore(this.score);
    this.gameOverNode.setBestScore(1000); // TODO:
    this.gameOverNode.show();
  }

  levelComplete() {
    this.levelCompleteNode.setLevel(this.level - 1);
    this.levelCompleteNode.setScore(this.score);
    this.levelCompleteNode.show();
  }

  onReturn() {
    this.mainMenu.show();
    this.gameOverNode.hide();
    this.levelCompleteNode.hide();

    // emit event
    this.events.emit("return");

    // deactivate all scenes
    this.scene.stop("scene-ui");
    this.scene.stop("scene-game");
    this.scene.setVisible(false, "scene-game");
    this.scene.setVisible(false, "scene-ui");
  }
}

export default UIScene;
