import PlayerSprite from "../classes/sprites/PlayerSprite.js";
import EnemiesGroup from "../classes/groups/EnemiesGroup.js";
import ObstaclesGroup from "../classes/groups/ObstaclesGroup.js";
import UfoSprite from "../classes/sprites/UfoSprite.js";

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
import obstaclePartImageUrl from "../assets/game/obstacle_part.png";
import ufoImageUrl from "../assets/game/ufo.png";
import blobImageUrl from "../assets/game/blob.png";

import StarfiledBg from "../classes/other/StarfieldBg.js";
import LevelController from "../classes/controllers/LevelController.js";
import EscapeMenuComponent from "../classes/components/EscapeMenuComponent.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({key: "scene-game"});

    // sprites and groups
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

  init(data) {
    this.disableProgress = false;


    if (data.level && data.level !== this.levelController.currentLevel) {
      this.levelController.setCurrentLevel(data.level);
    }

    

    this.events.once("shutdown", () => this.shutdown());
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

    this.load.image("obstacle-part", obstaclePartImageUrl);

    this.load.image("ufo", ufoImageUrl);

    this.load.image("blob", blobImageUrl);

    // generate starfield texture
    StarfiledBg.createStarfieldTexture(this);
  }

  create() {
    // Inputs
    this.cursor = this.input.keyboard.createCursorKeys();
    this.createBoundiresLines();

    // Sprites
    this.player = new PlayerSprite(this, 1920 / 2, 1080 - 128, this.enemiesBoundsX);
    this.enemies = new EnemiesGroup(this, this.levelController.getCurrentLevel());
    this.ufo = new UfoSprite(this, 100, 100);

    this.obstaclesGroup = new ObstaclesGroup(this);

    // Collision detection (enemies <-> player)
    this.physics.add.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.player, this.enemies.bullets, this.playerHit, null, this);

    // Collision detection (ufo <-> player)
    this.physics.add.overlap(this.player, this.ufo.bullets, this.playerHit, null, this);
    this.physics.add.overlap(this.player.bullets, this.ufo, this.ufoHit, null, this);

    // Collision detection (obstacles <-> other)
    this.physics.add.overlap(this.obstaclesGroup, this.enemies.bullets, this.obstacleBulletHit, null, this);
    this.physics.add.overlap(this.obstaclesGroup, this.player.bullets, this.obstacleBulletHit, null, this);
    this.physics.add.overlap(this.obstaclesGroup, this.enemies, o => o.onHit(), null, this);
    this.physics.add.overlap(this.obstaclesGroup, this.ufo.bullets, this.obstacleBulletHit, null, this);

    // UIScene obj
    this.UIScene = this.scene.get("scene-ui");

    // update HUD (UI)
    this.updateUI();

    // visuals
    this.fadeIn();
    this.starfiled = new StarfiledBg(this);

    // escape menu
    this.escapeMenuNode = new EscapeMenuComponent();

    this.escapeMenuNode.onReturn(() => {
      this.escapeMenuNode.hide();
      this.UIScene.onReturn();
    });

    this.escapeMenuHandler();
  }

  escapeMenuHandler() {
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

  shutdown() {
    this.escapeKey.destroy();

    this.ufo.destroy();
    this.player.destroy();
    this.enemies.destroy();
    this.obstaclesGroup.destroy();

    this.time.removeAllEvents();
  }

  updateUI(additionalData) {
    if (this.UIScene && this.UIScene.scene.isActive()) {
      this.UIScene.updateUI({
        lives: this.player.lives,
        score: this.player.score,
        level: this.levelController.currentLevel,
        ...additionalData,
      });
    } // try again after delay if scene not active
    else this.time.delayedCall(50, () => this.updateUI());
  }

  levelComplete() {
    this.levelController.nextLevel();
    this.disableProgress = true;
    this.updateUI({levelComplete: true});
  }

  gameWon() {
    this.disableProgress = true;
    this.levelController.setCurrentAsPassed();
    this.updateUI({gameWon: true});
  }

  gameOver() {
    this.disableProgress = true;
    this.enemies.gameOver();
    this.player.gameOver();
    this.updateUI();
  }

  // Collision detection
  enemyHit(bullet, enemy) {
    if (this.disableProgress) return;
    bullet.onHit();
    const enemyKilled = enemy.onHit(10);

    if (enemyKilled) {
      this.enemies.speedup();
      const scoreAmount = (Math.floor(enemy.maxHealth / 10) + 1) * 10;
      this.player.addScore(scoreAmount);
      this.updateUI();
    }

    // all enemies eliminated
    if (this.enemies.getLength() <= 0 && this.levelController.currentLevel < 15) this.levelComplete();
    else if (this.enemies.getLength() <= 0 && this.levelController.currentLevel >= 15) this.gameWon();
  }

  ufoHit(bullet, ufo) {
    bullet.onHit();
    ufo.onHit();
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
    const lastEnemy = enemies.at(-1);
    if (enemies.length && this.player.y <= lastEnemy.y + lastEnemy.displayHeight) this.gameOver();
  }

  obstacleBulletHit(obstaclePart, bullet) {
    obstaclePart.onHit(obstaclePart);
    bullet.onHit();
  }

  update(time, delta) {
    this.enemies.update();
    this.checkEnemyInvasion();
    this.starfiled.update(time, delta);
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
