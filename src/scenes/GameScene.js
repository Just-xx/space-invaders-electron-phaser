import {Scene} from "phaser";

import PlayerSprite from "../classes/PlayerSprite";
import EnemiesGroup from "../classes/EnemiesGroup";

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
    this.level = 1;
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
    // inputs
    this.cursor = this.input.keyboard.createCursorKeys();
    this.createBoundiresLines();

    // sprites
    this.player = new PlayerSprite(this, 1920 / 2, 1080 - 128, this.enemiesBoundsX);
    this.enemies = new EnemiesGroup(this);

    // collison detection
    this.physics.add.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.player, this.enemies.bullets, this.playerHit, null, this);

    this.updateUI();
  }

  updateUI() {
    this.events.emit("updateUI", {lives: this.player.lives, score: this.player.score, level: this.level});
  }

  enemyHit(bullet, enemy) {
    bullet.onHit();
    const enemyKilled = enemy.onHit(10);

    if (enemyKilled) {
      this.player.addScore();
      this.updateUI();
    }
  }

  playerHit(player, bullet) {
    bullet.onHit();
    player.onHit(bullet);
    this.updateUI();

    if (player.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.enemies.gameOver();
    this.player.gameOver();
    this.updateUI();
  }

  handleEnemiesReachPlayer() {
    if (this.player.lives <= 0) return;
    const enemies = this.enemies.getChildren();
    if (enemies.length && this.player.y <= enemies.at(-1).y) this.gameOver();
  }

  update() {
    this.enemies.update();
    this.handleEnemiesReachPlayer();
  }

  createBoundiresLines() {
    const graphicsBoundiresLines = this.add.graphics();

    // left line
    graphicsBoundiresLines.lineStyle(1, 0xfffffff, 1);
    graphicsBoundiresLines.moveTo(this.boundsX.left, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.left, this.boundsY.bottom);

    // right line
    graphicsBoundiresLines.moveTo(this.boundsX.right, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.right, this.boundsY.bottom);
    graphicsBoundiresLines.strokePath();
  }
}
