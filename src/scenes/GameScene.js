import { Scene } from "phaser";
import playerImageUrl from "../assets/game/player.png";
import BulletsGroup from "../classes/BulletsGroup";
import PlayerSprite from "../classes/PlayerSprite";
import EnemiesGroup from "../classes/EnemiesGroup";

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
    super({ key: "scene-game" });

    // spirtes and groups
    this.player;
    this.bullets;
    this.enemies;

    this.cursor;


    this.boundsX = { left: 128, right: 1792 }; // subtract from right value of enemy actaul width
    this.boundsY = { top: 128, bottom: 1000 };

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
    this.cursor = this.input.keyboard.createCursorKeys();
    this.createBoundiresLines();

    this.player = new PlayerSprite(this, 1920 / 2, 1080 - 128, this.enemiesBoundsX);
    this.enemies = new EnemiesGroup(this);

    this.physics.add.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);
  }

  gameOver() {
    this.enemies.gameOver();
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

  update() {
    this.enemies.update();
  }

  enemyHit(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.onHit(10);
  }
}
