import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import UIScene from "./scenes/UIScene";
import MainMenu from "./classes/MainMenu";

const mainMenu = new MainMenu();
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
  },
};

const game = new Phaser.Game(config);

function fadeOutMainMenu() {
  gameCanvas.style.opacity = 1;
  gameCanvas.style.zIndex = 1000;
}

mainMenu.onStart(() => {
  fadeOutMainMenu();
  game.scene.start("scene-game");
});

// document.querySelector('#menu-start-btn').dispatchEvent(new Event('click'));
