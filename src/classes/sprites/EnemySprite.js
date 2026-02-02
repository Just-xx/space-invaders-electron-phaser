// Import stałych z definicjami skali i typów wrogów.
import {ENEMIES_SCALES} from "../../constants/ENEMIES_SCALES";
import {ENEMY_TYPES} from "../../constants/ENEMY_TYPES";

// Definicja klasy EnemySprite, która dziedziczy po Phaser.Physics.Arcade.Sprite.
// Reprezentuje pojedynczego wroga w formacji.
class EnemySprite extends Phaser.Physics.Arcade.Sprite {
  // Konstruktor klasy, inicjalizuje obiekt wroga.
  constructor(scene, x, y, enemyType, health = 100) {
    // Wywołanie konstruktora klasy nadrzędnej z odpowiednią teksturą dla danego typu wroga.
    super(scene, x, y, ENEMY_TYPES[enemyType]);

    // Dodanie obiektu do sceny i fizyki Phrasera.
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    // Właściwości specyficzne dla wroga.
    this.enemyType = enemyType; // Typ wroga (wpływa na teksturę i skalę).
    this.maxHealth = health; // Maksymalne zdrowie.
    this.health = this.maxHealth; // Aktualne zdrowie.
    this.healthBarActive = false; // Flaga, czy pasek zdrowia jest aktywny.

    // Właściwości związane z animacją (obecnie nieużywane w tej klasie).
    this.flipTime = 1000;
    this.timeToFlip = this.flipTime;
    this.direction = "RIGHT";

    // Ustawienia ciała fizycznego i wyglądu.
    this.body.allowGravity = false;
    this.setOrigin(0, 0);
    this.setScale(ENEMIES_SCALES[this.enemyType]); // Ustawienie skali na podstawie typu wroga.

    // Utworzenie obiektu graficznego dla paska zdrowia.
    this.healthBar = this.scene.add.graphics();
    this.healthBar.setVisible(false); // Początkowo niewidoczny.

    // Inicjalizacja dźwięków trafienia i eksplozji.
    this.hitSound = this.scene.sound.add("inv-killed");
    this.explosionSound = this.scene.sound.add("explosion");

    // Definicja cząsteczek emitowanych przy zniszczeniu wroga.
    this.particles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 100, max: 300},
      angle: {min: 0, max: 360},
      scale: {start: 0.1, end: 0},
      lifespan: {min: 200, max: 500},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00],
      emitting: false,
    });
  }

  // Metoda aktualizująca wygląd paska zdrowia.
  updateHealthBar() {
    // Aktywuje i pokazuje pasek zdrowia, gdy wróg po raz pierwszy otrzyma obrażenia.
    if (!this.healthBarActive) {
      this.healthBarActive = true;
      this.healthBar.setVisible(true);
    }

    this.healthBar.clear(); // Wyczyszczenie poprzedniego stanu paska.

    // Tło paska zdrowia.
    const width = this.displayWidth;
    const height = 6;
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(0, -height - 2, width, height);

    // Wypełnienie paska zdrowia w zależności od procentu zdrowia.
    const healthPercentage = this.health / this.maxHealth;
    // Zmiana koloru w zależności od poziomu zdrowia.
    const healthBarColor = healthPercentage > 0.6 ? 0x00ff00 : healthPercentage > 0.3 ? 0xffff00 : 0xff0000;
    this.healthBar.fillStyle(healthBarColor, 1);
    this.healthBar.fillRect(0, -height - 2, width * healthPercentage, height);
  }

  // Metoda wywoływana, gdy wróg zostanie trafiony.
  onHit(damage) {
    if (this.health <= 0) return; // Ignoruj trafienia, jeśli wróg już jest zniszczony.

    this.health -= damage; // Zmniejszenie zdrowia.
    if (this.health <= 0) {
      this.health = 0;
      this.explosionSound.play({volume: this.scene.volume.effects}); // Dźwięk eksplozji przy zniszczeniu.
    } else {
      this.hitSound.play({volume: this.scene.volume.effects}); // Dźwięk trafienia.
    }

    this.updateHealthBar(); // Aktualizacja paska zdrowia.

    // Jeśli zdrowie spadnie do zera, zniszcz wróg.
    if (this.health === 0) {
      this.particles.explode(20, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2); // Efekt cząsteczkowy.
      this.destroy(); // Zniszczenie obiektu.
      return true; // Zwraca prawdę, sygnalizując zniszczenie.
    }

    return false; // Zwraca fałsz, jeśli wróg przeżył.
  }

  // Metoda cyklu życia, wywoływana w każdej klatce.
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // Aktualizacja pozycji paska zdrowia, aby podążał za wrogiem.
    if (this.healthBarActive) {
      this.healthBar.setPosition(this.x, this.y);
    }
  }

  // Metoda do odwracania tekstury wroga (animacja).
  flip(time, delta) {
    this.flipX = !this.flipX;
  }

  // Metoda cyklu życia, wywoływana przy niszczeniu obiektu.
  destroy(fromScene) {
    // Zniszczenie dodatkowych obiektów (pasek zdrowia, dźwięki), aby zwolnić pamięć.
    this.healthBar.destroy();
    this.hitSound.destroy();
    this.explosionSound.destroy();
    super.destroy(fromScene);
  }
}

export default EnemySprite;
