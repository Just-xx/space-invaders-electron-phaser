import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

class MainMenu {
  constructor() {
    this.visible = true;
    this.menuBtns = document.querySelectorAll(".menu-btn");

    this.menuBtns.forEach(btn => {
      btn.addEventListener("click", this.hide);
    });
  }

  hide() {
    const heroImgWrapper = document.querySelector(".hero-menu-img-wrapper");
    const titleWrapper = document.querySelector(".title-wrapper");
    const menuBtns = document.querySelector(".menu-btns-wrapper");
    const game = document.querySelector("#game");

    heroImgWrapper.style.transform = "translateX(100%) rotate(25deg)";
    heroImgWrapper.style.opacity = "0";

    setTimeout(() => {
      titleWrapper.style.transform = "translateY(-100%)";
      titleWrapper.style.opacity = "0";
    }, 150);

    setTimeout(() => {
      menuBtns.style.transform = "translateY(100%)";
      menuBtns.style.opacity = "0";
    }, 300);

    setTimeout(() => {
      game.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    }, 450);

    this.visible = false;
  }

  onStart(fn) {
    this.menuBtns[0].addEventListener("click", fn);
  }

  options() {}
}

const mainMenu = new MainMenu();
const gameCanvas = document.querySelector("#game-canvas");

const config = {
  type: Phaser.WEBGL,
  width: 1920,
  height: 1080,
  canvas: gameCanvas,
  // transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  scene: [],
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
game.scene.add("scene-game", GameScene, false);

mainMenu.onStart(() => {
  gameCanvas.style.opacity = 1;
  gameCanvas.style.zIndex = 1000;

  game.scene.start("scene-game");
});

document.querySelector('#menu-start-btn').dispatchEvent(new Event('click'));
