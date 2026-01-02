import {Game, RIGHT, Scene} from "phaser";
import btnUrl from "../assets/game/btn_var_0.png";
import GameOverComponent from "../classes/components/GameOverComponent";
import LevelCompleteComponent from "../classes/components/LevelCompleteComponent";
import GameWonComponent from "../classes/components/GameWonComponent";

class UIScene extends Scene {
  constructor() {
    super({key: "scene-ui", active: true});

    this.score = 0;
    this.maxScore = 0;
    this.lives = 3;
    this.level = 1;

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

    this.level = gameScene.levelController.getCurrentLevel();

    // game over screen handling
    this.gameOverNode = new GameOverComponent();

    this.gameOverNode.onRestart(() => {
      this.gameOverNode.hide();
      this.events.emit("restart");
    });

    this.gameOverNode.onReturn(() => this.onReturn());

    // level complete screen
    this.levelCompleteComponent = new LevelCompleteComponent();

    this.levelCompleteComponent.onNextLevelClick(() => {
      this.levelCompleteComponent.hide();
      this.events.emit("nextLevelStart");
    });

    this.levelCompleteComponent.onReturn(() => this.onReturn());

    // game won screen
    this.gameWonComponent = new GameWonComponent();
    this.gameWonComponent.onReturn(() => this.onReturn());
  }

  updateUI(data) {
    if (!this.scoreText) return;

    this.score = data.score;
    this.lives = data.lives;
    this.level = data.level;

    this.scoreText.setText(`Wynik: ${this.score}`);
    this.livesText.setText(`Życia: ${this.lives}`);
    this.levelText.setText(`Poziom: ${this.level}`);

    if (this.lives <= 0) this.showGameOverComponent();
    if (data.levelComplete) {
      this.showLevelComponent();
      this.level--;
      this.levelText.setText(`Poziom: ${this.level}`);
    }

    if (data.gameWon) this.showGameWonComponent();
  }

  fadeIn() {
    this.tweens.add({
      targets: [this.scoreText, this.levelText, this.livesText],
      alpha: {from: 0, to: 1},
      duration: 2400,
      ease: "EaseIn",
    });
  }

  updateListener() {}

  showGameOverComponent() {
    this.gameOverNode.setLevel(this.level);
    this.gameOverNode.setScore(this.score);
    this.gameOverNode.show();
  }

  showLevelComponent() {
    this.levelCompleteComponent.setLevel(this.level - 1);
    this.levelCompleteComponent.setScore(this.score);
    this.levelCompleteComponent.show();
  }

  showGameWonComponent() {
    this.gameWonComponent.show();
  }

  onReturn() {
    // hide all possible components
    this.mainMenu.show();
    this.gameOverNode.hide();
    this.levelCompleteComponent.hide();
    this.gameWonComponent.hide();

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
