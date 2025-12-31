import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import UIScene from "./scenes/UIScene";
import MainMenu from "./classes/MainMenu";

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
  parent: "game",
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);
const mainMenu = new MainMenu();

mainMenu.onStart(() => {
  gameCanvas.style.opacity = 1;
  game.scene.start('scene-game');
  game.scene.start('scene-ui', mainMenu);
});

document.querySelector('#menu-start-btn').dispatchEvent(new Event('click'));
