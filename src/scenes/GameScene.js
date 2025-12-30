import {Scene} from "phaser";

import PlayerSprite from "../classes/PlayerSprite";
import EnemiesGroup from "../classes/EnemiesGroup";
import LevelController from "../classes/LevelController";

import playerImageUrl from "../assets/game/player.png";

import bullet0ImageUrl from "../assets/game/bullet_0.png";
import bullet1ImageUrl from "../assets/game/bullet_1.png";

import enemy0ImageUrl from "../assets/game/enemy_0.png";
import enemy1ImageUrl from "../assets/game/enemy_1.png";
import enemy2ImageUrl from "../assets/game/enemy_2.png";
import enemy3ImageUrl from "../assets/game/enemy_3.png";
import enemy4ImageUrl from "../assets/game/enemy_4.png";
import enemy5ImageUrl from "../assets/game/enemy_5.png";
import enemy6ImageUrl from "../assets/game/enemy_6.png";
import EscapeMenuNode from "../classes/EscapeMenuNode";

export default class GameScene extends Scene {
  constructor() {
    super({key: "scene-game"});

    // spirtes and groups
    this.player;
    this.bullets;
    this.enemies;

    this.cursor;

    // x and y limits of sprites
    this.boundsX = {left: 128, right: 1792};
    this.boundsY = {top: 128, bottom: 1000};

    this.disableProgress = false;
    this.levelController = new LevelController();
  }

  init() {
    this.disableProgress = false;
  }

  preload() {
    this.load.image("player", playerImageUrl);

    // bullets
    this.load.image("bullet-type1", bullet1ImageUrl);
    this.load.image("bullet", bullet0ImageUrl);

    // enemies types
    this.load.image("enemy-type0", enemy0ImageUrl);
    this.load.image("enemy-type1", enemy1ImageUrl);
    this.load.image("enemy-type2", enemy2ImageUrl);
    this.load.image("enemy-type3", enemy3ImageUrl);
    this.load.image("enemy-type4", enemy4ImageUrl);
    this.load.image("enemy-type5", enemy5ImageUrl);
    this.load.image("enemy-type6", enemy6ImageUrl);
  }

  create() {
    // Inputs
    this.cursor = this.input.keyboard.createCursorKeys();
    this.createBoundiresLines();

    // Sprites
    this.player = new PlayerSprite(this, 1920 / 2, 1080 - 128, this.enemiesBoundsX);
    this.enemies = new EnemiesGroup(this, this.levelController.getCurrentLevel());

    // Collison detection
    this.physics.add.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.player, this.enemies.bullets, this.playerHit, null, this);

    // update HUD (UI)
    this.updateUI();

    // on restart event
    this.UIScene = this.scene.get("scene-ui");
    this.UIScene.events.once("restart", () => this.restartLevel());

    // on next level start event
    this.UIScene.events.once("nextLevelStart", () => this.nextLevelStart());

    // fade in effect
    this.fadeIn();

    this.createStarfieldTexture();
    this.createStarfield();

    // escape menu
    this.escapeMenuNode = new EscapeMenuNode();
    
    this.escapeMenuNode.onReturn(() => {
      this.escapeMenuNode.hide();
      this.UIScene.onReturn();
    });

    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.escapeKey.on("down", () => {
      if (!this.escapeMenuNode.visible) {
        this.escapeMenuNode.show(this);
        this.scene.pause();
      } else {
        this.escapeMenuNode.hide();
        this.scene.resume();
      }
    });

    
  }

  createStarfieldTexture() {
    const rt = this.make.graphics({x: 0, y: 0, add: false});

    rt.fillStyle(0x000000, 0);
    rt.fillRect(0, 0, this.scale.width, this.scale.height);

    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const alpha = Phaser.Math.FloatBetween(0.5, 1);

      rt.fillStyle(0xffffff, alpha);
      rt.fillPoint(x, y, size);
    }

    rt.generateTexture("starfield", this.scale.width, this.scale.height);
  }

  createStarfield() {
    const {width, height} = this.scale;

    this.bgBack = this.add.tileSprite(0, 0, width, height, "starfield").setOrigin(0, 0).setDepth(-10).setAlpha(0.4);

    this.bgFront = this.add.tileSprite(0, 0, width, height, "starfield").setOrigin(0, 0).setDepth(-5).setAlpha(0.6);

    this.scale.on("resize", size => {
      this.bgBack.setSize(size.width, size.height);
      this.bgFront.setSize(size.width, size.height);
    });
  }

  updateUI() {
    this.events.emit("updateUI", {
      lives: this.player.lives,
      score: this.player.score,
      level: this.levelController.currentLevel,
    });
  }

  // game states actions
  restartLevel() {
    this.scene.restart();
  }

  levelComplete() {
    this.levelController.nextLevel();
    this.disableProgress = true;
    this.updateUI();
  }

  nextLevelStart() {
    this.scene.restart();
  }

  gameOver() {
    this.enemies.gameOver();
    this.player.gameOver();
    this.updateUI();
  }

  // Collision detection
  enemyHit(bullet, enemy) {
    if (this.disableProgress) return;
    bullet.onHit();
    const enemyKilled = enemy.onHit(10);

    if (!enemyKilled) return;

    const scoreAmount = (Math.floor(enemy.maxHealth / 10) + 1) * 10;
    this.player.addScore(scoreAmount);
    this.updateUI();

    // all enemies eliminated
    if (this.enemies.getLength() - 1 <= 0) {
      this.levelComplete();
    }
  }

  // Collision detection
  playerHit(player, bullet) {
    if (this.disableProgress) return;

    bullet.onHit();
    player.onHit(bullet);
    this.updateUI();

    if (player.lives <= 0) {
      this.gameOver();
    }
  }

  // Collision detection
  checkEnemyInvasion() {
    if (this.disableProgress) return;
    if (this.player.lives <= 0) return;
    const enemies = this.enemies.getChildren();
    if (enemies.length && this.player.y <= enemies.at(-1).y) this.gameOver();
  }

  update(time, delta) {
    this.enemies.update();
    this.checkEnemyInvasion();

    const speed = 0.02;
    this.bgBack.tilePositionY -= speed * delta;
    this.bgFront.tilePositionY -= speed * 3 * delta;
  }

  fadeIn() {
    this.disableProgress = true;

    this.tweens.add({
      targets: [this.player],
      alpha: {from: 1, to: 0.2},
      duration: 150,
      ease: "EaseIn",
      yoyo: true,
      repeat: 7,
    });

    const enemies = this.enemies.getChildren();
    enemies.forEach(e => e.setAlpha(0));

    this.tweens.add({
      targets: enemies,
      alpha: {from: 0.5, to: 0.2},
      duration: 150,
      ease: "EaseIn",
      yoyo: true,
      repeat: 6,
    });

    this.time.delayedCall(2400, () => {
      this.tweens.add({
        targets: enemies,
        alpha: {from: 0.2, to: 1},
        duration: 150,
        ease: "EaseIn",
        onComplete: () => {
          this.disableProgress = false;
        },
      });
    });
  }

  // other
  createBoundiresLines() {
    const graphicsBoundiresLines = this.add.graphics();
    // left line
    graphicsBoundiresLines.lineStyle(1, 0xfffffff, 0.05);
    graphicsBoundiresLines.moveTo(this.boundsX.left, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.left, this.boundsY.bottom);
    // right line
    graphicsBoundiresLines.moveTo(this.boundsX.right, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.right, this.boundsY.bottom);
    graphicsBoundiresLines.strokePath();
  }
}
