import "./styles/main.css";
import "./styles/media.css";

import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";
import MainMenuController from "./classes/controllers/MainMenuController.js";


const gameCanvas = document.querySelector("#game-canvas");

const config = {
  type: Phaser.WEBGL,
  width: 1920,
  height: 1080,
  canvas: gameCanvas,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 200},
      debug: false,
    },
  },
  scene: [UIScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
    limit: 0,
  }
};

const game = new Phaser.Game(config);
const mainMenuController = new MainMenuController(game);

game.showGameCanvas = () => {
  const gameCanvas = document.querySelector("#game-canvas");
  gameCanvas.style.opacity = 1;
}

mainMenuController.onStart(() => {
  game.showGameCanvas();
  game.scene.start('scene-game');
  game.scene.start('scene-ui', mainMenuController);
});

