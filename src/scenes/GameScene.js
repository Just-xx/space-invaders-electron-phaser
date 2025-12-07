import { Scene } from "phaser";
import enemyImageUrl from "../assets/game/enemy.png";
import playerImageUrl from "../assets/game/player.png";

export default class GameScene extends Scene {
  constructor() {
    super({ key: "scene-game" });

    // spirtes and groups
    this.player;
    this.enemies;

    this.cursor;

    // player properties
    this.playerSpeed = 500;
    this.PLAYER_SCALE = 0.14;
    this.PLAYER_MOVMENT_ANGLE = 5;

    // enemies properties
    this.ENEMIES_SCALE = 0.115;
    this.ENEMIES_SPACING = 22;
    this.enemiesSpeed = 60;
    this.enemiesLevel = 0;
    this.enemiesRowsCount = 4; // zero also counts
    this.enemiesColumnsCount = 11; // zero also counts
    this.enemiesBoundsX = { left: 128, right: 1792 }; // subtract from right value of enemy actaul width
    this.enemiesStartY = 128;
    this.enemiesStartX = this.enemiesBoundsX.left;
    this.enemyWidth = -1;
    this.enemyHeight = -1;
    this.disableProgress = false;
  }

  preload() {
    this.load.image("enemy", enemyImageUrl);
    this.load.image("player", playerImageUrl);
  }

  create() {
    this.lives = 3;
    this.score = 0;
    this.scoreText = this.add.text(32, 32, "Wynik: 0", { font: "28px Orbitron" });
    this.livesText = this.add.text(this.scoreText.width + this.scoreText.x + 32, 32, "Życia: 3", {
      font: "28px Orbitron",
    });

    this.cameras.main.setBackgroundColor("#120921");

    this.#createEnemies();
    this.#createPlayer();

    this.cursor = this.input.keyboard.createCursorKeys();

    this.#createBoundiresLines();
  }

  #createBoundiresLines() {
    const graphicsBoundiresLines = this.add.graphics();

    // left line
    graphicsBoundiresLines.lineStyle(1, 0x1c0e34, 1);
    graphicsBoundiresLines.moveTo(this.enemiesBoundsX.left, this.enemiesStartY);
    graphicsBoundiresLines.lineTo(this.enemiesBoundsX.left, 1080 - this.enemiesStartY);

    // right line
    graphicsBoundiresLines.moveTo(this.enemiesBoundsX.right + this.enemyWidth, this.enemiesStartY);
    graphicsBoundiresLines.lineTo(this.enemiesBoundsX.right + this.enemyWidth, 1080 - this.enemiesStartY);
    graphicsBoundiresLines.strokePath();
  }

  #createPlayer() {
    this.player = this.physics.add.sprite(1920 / 2, 1080 - this.enemiesStartY, "player").setOrigin(0, 0);
    this.player.setScale(this.PLAYER_SCALE);
    this.player.body.allowGravity = false;
  }

  #createEnemies() {
    this.enemies = this.physics.add.group({
      allowGravity: false,
      immovable: false,
    });

    for (let j = 0; j <= this.enemiesRowsCount; j++) {
      for (let i = 0; i <= this.enemiesColumnsCount; i++) {
        if (j === 0 && i === 0) {
          const firstEnemy = this.enemies
            .create(this.enemiesBoundsX.left, this.enemiesStartY, "enemy")
            .setScale(this.ENEMIES_SCALE)
            .setOrigin(0, 0);
          firstEnemy.flipX = true;
          this.enemyWidth = firstEnemy.displayWidth;
          this.enemyHeight = firstEnemy.displayHeight;
        } else {
          const xPos = this.enemiesBoundsX.left + (this.enemyWidth + this.ENEMIES_SPACING) * i;
          const yPos = this.enemiesStartY + (this.enemyHeight + this.ENEMIES_SPACING) * j;
          const e = this.enemies.create(xPos, yPos, "enemy").setScale(this.ENEMIES_SCALE).setOrigin(0, 0);
          e.flipX = true;
        }
      }
    }

    // correct boundires to be equal
    this.enemiesBoundsX.right = this.enemiesBoundsX.right - this.enemyWidth;

    this.enemies.setVelocityX(this.enemiesSpeed);
  }

  update() {
    this.scoreText.setText(`Wynik: ${this.score}`);
    this.livesText.setText(`Życia: ${this.lives}`);

    this.#handleEnemyBoundiresCollision();
    this.#updatePlayerPos();
  }

  #updatePlayerPos() {
    const { left, right } = this.cursor;

    if (left.isDown && this.player.x >= this.enemiesBoundsX.left) {
      this.player.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.player.setAngle(-this.PLAYER_MOVMENT_ANGLE);
      this.player.setVelocityX(-this.playerSpeed);
      this.player.flipX = true;
    } else if (right.isDown && this.player.x <= this.enemiesBoundsX.right) {
      this.player.setScale(this.PLAYER_SCALE + 0.01, this.PLAYER_SCALE);
      this.player.setAngle(this.PLAYER_MOVMENT_ANGLE);
      this.player.setVelocityX(this.playerSpeed);
      this.player.flipX = false;
    } else {
      this.player.setAngle(0);
      this.player.setScale(this.PLAYER_SCALE);
      this.player.setVelocity(0);
    }
  }

  #handleEnemyBoundiresCollision() {
    this.enemies.getChildren().forEach(child => {
      if (child.x >= this.enemiesBoundsX.right && child.body.velocity.x > 0) {
        this.enemies.setVelocityX(-this.enemiesSpeed);
        this.#moveEnemiesDown();
      } else if (child.x <= this.enemiesBoundsX.left && child.body.velocity.x < 0) {
        this.enemies.setVelocityX(this.enemiesSpeed);
        this.#moveEnemiesDown();
      }
    });
  }

  #moveEnemiesDown() {
    if (this.disableProgress) return;
    this.enemiesLevel++;
    
    this.enemies.getChildren().forEach(child => {
      child.y += (this.enemyHeight + this.ENEMIES_SPACING) / 2;
      child.flipX = !child.flipX;
    });
    this.enemiesSpeed += 10;
  }
}
