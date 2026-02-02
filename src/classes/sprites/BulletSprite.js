// Import biblioteki Phaser.
import * as Phaser from "phaser";

// Definicja klasy Bullet, która dziedziczy po Phaser.Physics.Arcade.Sprite.
// Reprezentuje pojedynczy pocisk w grze.
class Bullet extends Phaser.Physics.Arcade.Sprite {
  // Konstruktor klasy, inicjalizuje obiekt pocisku.
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;

    // Właściwości pocisku.
    this.velocity = 600; // Prędkość pionowa.
    this.spread = 400; // Rozrzut poziomy dla pocisków wroga.

    // Dźwięk wystrzału.
    this.shootSound = this.scene.sound.add("shoot");

    // Definicja emitera cząsteczek dla śladu pocisku gracza.
    this.trailEmitter = this.scene.add.particles(0, 0, "bullet", {
      speed: 10,
      scale: {start: 0.05, end: 0},
      alpha: {start: 0.7, end: 0},
      lifespan: 250,
      blendMode: "ADD",
      tint: 0xffffff,
      emitting: true,
    });

    // Definicja emitera cząsteczek dla śladu pocisku wroga.
    this.enemyTrailEmitter = this.scene.add.particles(0, 0, "bullet", {
      speed: 10,
      scale: {start: 0.05, end: 0},
      alpha: {start: 0.7, end: 0},
      lifespan: 250,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00], // Inny kolor dla wroga.
      emitting: true,
    });
  }

  // Prywatna metoda inicjalizująca wspólne właściwości pocisku.
  #init() {
    this.setScale(0.06);
    this.body.allowGravity = false;
    this.depth = -1; // Ustawienie głębokości renderowania, aby pocisk był pod innymi obiektami.
  }

  // Metoda aktywująca i wystrzeliwująca pocisk gracza.
  fire(x, y) {
    this.#init(); // Inicjalizacja.

    // Aktywacja ciała fizycznego i ustawienie pozycji.
    this.enableBody(true, x, y, true, true);
    // Ustawienie prędkości pionowej (w górę).
    this.setVelocityY(-this.velocity);

    // Uruchomienie śladu cząsteczkowego.
    this.trailEmitter.start();
    this.trailEmitter.startFollow(this);

    // Odtworzenie dźwięku wystrzału.
    this.shootSound.play({volume: this.scene.volume.effects});
  }

  // Metoda aktywująca i wystrzeliwująca pocisk wroga.
  enemyFire(x, y) {
    this.setTexture("bullet-type1"); // Użycie innej tekstury dla pocisku wroga.
    this.#init();

    this.enableBody(true, x, y, true, true);
    // Ustawienie losowej prędkości poziomej (rozrzut).
    this.setVelocityX((Math.random() - 0.5) * this.spread);
    // Ustawienie prędkości pionowej (w dół).
    this.setVelocityY(this.velocity);

    // Uruchomienie śladu cząsteczkowego dla wroga.
    this.enemyTrailEmitter.start();
    this.enemyTrailEmitter.startFollow(this);

    // Odtworzenie zmodyfikowanego dźwięku wystrzału.
    this.shootSound.play({volume: this.scene.volume.effects / 2, detune: 500});
  }

  // Metoda wywoływana, gdy pocisk w coś trafi.
  onHit() {
    // Zatrzymanie emiterów cząsteczek.
    this.trailEmitter.stop();
    this.enemyTrailEmitter.stop();
    // Dezaktywacja pocisku (ukrycie i wyłączenie z fizyki).
    this.disableBody(true, true);
  }

  // Metoda cyklu życia, wywoływana w każdej klatce przed główną pętlą `update`.
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // Sprawdzenie, czy pocisk wyleciał poza ekran.
    if (this.y <= 0 || this.y > this.scene.sys.game.config.height) this.onHit();
  }

  // Metoda cyklu życia, wywoływana przy niszczeniu obiektu.
  destroy(fromScene) {
    // Zniszczenie obiektu dźwiękowego, aby zwolnić pamięć.
    this.shootSound.destroy();
    super.destroy(fromScene);
  }
}

export default Bullet;
