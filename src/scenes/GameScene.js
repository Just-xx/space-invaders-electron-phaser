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

    // enemies properties
    this.ENEMIES_SCALE = 0.12;
    this.ENEMIES_SPACING = 22;
    this.enemiesSpeed = 80;
    this.enemiesLevel = 0;
    this.enemiesRowsCount = 5;
    this.enemiesColumnsCount = 11;
    this.enemiesBoundsX = { left: 128, right: 1792 };
    this.enemiesStartY = 128;
    this.enemiesStartX = this.enemiesBoundsX.left;
    this.enemyWidth = -1;
    this.enemyHeight = -1;
    this.disableProgress = true;
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
  }

  #createPlayer() {
    this.player = this.physics.add.sprite(500, 500, "player");
    this.player.setScale(0.15);
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
          this.enemies.create(this.enemiesBoundsX.left, this.enemiesStartY, "enemy").setScale(this.ENEMIES_SCALE);
          this.enemyWidth = this.enemies.getChildren()[0].displayWidth;
          this.enemyHeight = this.enemies.getChildren()[0].displayHeight;
        } else {
          const xPos = this.enemiesBoundsX.left + (this.enemyWidth + this.ENEMIES_SPACING) * i;
          const yPos = this.enemiesStartY + (this.enemyHeight + this.ENEMIES_SPACING) * j;
          this.enemies.create(xPos, yPos, "enemy").setScale(this.ENEMIES_SCALE);
        }
      }
    }

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

    if (left.isDown) this.player.setVelocityX(-500);
    else if (right.isDown) this.player.setVelocityX(500);
    else this.player.setVelocity(0);
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
      child.body.y = child.body.y + this.enemyHeight + this.ENEMIES_SPACING;
    });
    this.enemiesSpeed += 10;
  }
}
