// Import biblioteki Phaser i klasy BulletsGroup.
import Phaser from "phaser";
import BulletsGroup from "../groups/BulletsGroup";

// Definicja klasy UfoSprite, która dziedziczy po Phaser.Physics.Arcade.Sprite.
// Reprezentuje statek UFO, który losowo pojawia się na ekranie.
class UfoSprite extends Phaser.Physics.Arcade.Sprite {
  // Konstruktor klasy, inicjalizuje obiekt UFO.
  constructor(scene, x, y) {
    super(scene, x, y, "ufo");

    // Dodanie obiektu do sceny i fizyki Phrasera.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene; // Zapisanie referencji do sceny.

    // Ustawienia początkowe obiektu UFO.
    this.setScale(0.13); // Skalowanie obiektu.
    this.body.allowGravity = false; // Wyłączenie grawitacji.

    this.x = -300; // Pozycja początkowa poza ekranem.
    this.y = -300;

    this.inProgress = false; // Flaga określająca, czy UFO jest w trakcie przelotu.
    this.setVisible(false); // Początkowo niewidoczny.
    this.lastDepth = -1; // Ostatnia zarejestrowana głębokość (pozycja Y) formacji wrogów.

    // Grupa pocisków dla UFO.
    this.bullets = new BulletsGroup(this.scene);

    // Definicja cząsteczek emitowanych przy zniszczeniu UFO.
    this.destroyParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 100, max: 300},
      angle: {min: 0, max: 360},
      scale: {start: 0.1, end: 0},
      lifespan: {min: 200, max: 500},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0xff0000, 0xffa500, 0xffff00],
      emitting: false,
    });

    // Definicja cząsteczek tworzących ślad za UFO.
    this.trailParticles = this.scene.add.particles(0, 0, "blob", {
      speed: 0,
      scale: {start: 0.9, end: 0.9},
      alpha: {start: 0.05, end: 0},
      lifespan: 1000,
      blendMode: "NORMAL",
      emitting: false,
      frequency: 20,
    });

    // Ustawienie głębokości renderowania (kolejności warstw).
    this.trailParticles.setDepth(2);
    this.destroyParticles.setDepth(3);
    this.setDepth(5);

    // Inicjalizacja dźwięków.
    this.flySound = this.scene.sound.add("ufo-lowpitch");
    this.explosionSound = this.scene.sound.add("explosion");

    // Licznik wdrożeń UFO i czas ostatniego wdrożenia.
    this.deployCount = 0;
    this.lastDeployed = -15000;
  }

  // Metoda rozpoczynająca przelot UFO.
  start(direction) {
    if (this.scene.enemies.getLength() <= 0) return; // Nie startuj, jeśli nie ma wrogów.
    this.deployCount++;
    this.inProgress = true;
    this.setVisible(true);

    // Ustalenie wysokości przelotu na podstawie pozycji wrogów.
    const firstEnemie = this.scene.enemies.getChildren()[0];
    const startY = firstEnemie.y - firstEnemie.displayHeight * 3;

    // Definicja wektorów dla krzywej po której porusza się UFO.
    let vectorA = new Phaser.Math.Vector2(-this.displayWidth, startY);
    let vectorB = new Phaser.Math.Vector2(this.scene.scale.width + this.displayWidth, startY);
    const vectorCenter = new Phaser.Math.Vector2(
      this.scene.scale.width / 2,
      2 * firstEnemie.y - startY - this.displayHeight * 2
    );

    // Uruchomienie śladu cząsteczkowego.
    this.trailParticles.startFollow(this);
    this.trailParticles.start();

    // Ustalenie kierunku przelotu.
    if (!direction) {
      const temp = vectorA;
      vectorA = vectorB;
      vectorB = temp;
    }

    const duration = Math.round(Math.random() * 2000 + 6000); // Losowy czas trwania przelotu.

    // Utworzenie ścieżki (krzywej Beziera).
    const path = new Phaser.Curves.QuadraticBezier(vectorA, vectorCenter, vectorB);

    // Animacja ruchu wzdłuż ścieżki.
    this.animation = this.scene.tweens.add({
      targets: {t: 0},
      t: 1,
      duration,
      onUpdate: (tween, target) => {
        const position = path.getPoint(target.t);
        this.setPosition(position.x, position.y);
      },
      onComplete: () => {
        // Reset stanu po zakończeniu animacji.
        this.inProgress = false;
        this.setVisible(false);
        this.setPosition(-300, -300);
        this.trailParticles.stop();
        this.stopFlySound();
      },
    });
  }

  // Odtwarza dźwięk przelotu z efektem fadeIn.
  playFlySound() {
    this.flySound.play({
      volume: 0,
      loop: true,
    });

    this.scene.tweens.add({
      targets: this.flySound,
      volume: {from: 0, to: this.scene.volume.effects / 2},
      duration: 2000,
    });
  }

  // Wycisza dźwięk przelotu z efektem fadeOut.
  stopFlySound() {
    this.scene.tweens.add({
      targets: this.flySound,
      volume: 0,
      duration: 2000,
    });
  }

  // Metoda pomocnicza do rysowania ścieżki (używana do debugowania).
  drawPath(path) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.3);
    path.draw(graphics);
  }

  // Metoda cyklu życia, wywoływana w każdej klatce.
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.scene.enemies.getLength() <= 0) return;

    // Sprawdzenie, czy warunki do rozpoczęcia przelotu są spełnione.
    if (this.checkStartCondition(time)) {
      this.inProgress = true;
      const timeToStart = Math.round(Math.random() * 1500 + 1000);
      this.playFlySound();
      this.scene.time.delayedCall(timeToStart, () => this.start(Math.round(Math.random())));
    }

    // Obsługa automatycznego strzelania.
    this.autoShooting();

    // Zatrzymanie dźwięku, jeśli przelot się zakończył.
    if (!this.inProgress && this.flySound.isPlaying) this.stopFlySound();
  }

  // Logika automatycznego strzelania przez UFO.
  autoShooting() {
    if (
      this.inProgress &&
      this.visible &&
      this.x > this.scene.boundsX.left + 128 &&
      this.x < this.scene.boundsX.right - 128
    ) {
      // Szansa na strzał wzrasta wraz z poziomem trudności.
      // (czym mniejsza liczba, tym większa szansa)
      const shotChance = 20 / this.scene.levelController.currentLevel + 12;
      this.bullets.handleEnemyFire(this, shotChance);
    }
  }

  // Logika określająca, czy UFO powinno się pojawić.
  // Uwzględnia m.in. postęp wrogów, numer poziomu, czas od ostatniego przelotu i losową szansę.
  checkStartCondition(time) {
    if (this.inProgress) return false;

    const depth = this.scene.enemies.depthLevel;
    const level = this.scene.levelController.currentLevel;

    if (depth === this.lastDepth || depth === 0) return false;
    this.lastDepth = depth;

    // Warunki startowe zależne od postępu wrogów i numeru poziomu.
    if ((depth === 5 && this.deployCount === 0) || (depth === 2 && this.deployCount === 0 && level < 6)) {
      this.lastDeployed = time;
      return true;
    }

    // Minimalny odstęp czasowy między przelotami.
    if (time - this.lastDeployed < 13000) {
      return false;
    }

    // Obliczenie szansy na pojawienie się w zależności od poziomu.
    const minChance = 0.1;
    const maxChance = 0.6;
    const maxLevel = 15;

    const safeLevel = Phaser.Math.Clamp(level, 1, maxLevel);
    const t = (safeLevel - 1) / (maxLevel - 1);
    const actualChance = minChance + t * (maxChance - minChance);

    // Ograniczenie liczby przelotów na poziom.
    const limit = Math.round(actualChance * Phaser.Math.Clamp(level, 10, maxLevel));
    if (limit <= this.deployCount) return false;

    // Losowanie, czy UFO ma się pojawić.
    const result = Math.random() <= actualChance;
    if (result) this.lastDeployed = time;
    return result;
  }

  // Metoda wywoływana, gdy UFO zostanie trafione.
  onHit() {
    this.animation.stop(); // Zatrzymanie animacji ruchu.
    // Emisja cząsteczek eksplozji.
    this.destroyParticles.explode(20, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);

    this.stopFlySound(); // Zatrzymanie dźwięku przelotu.
    this.explosionSound.play({volume: this.scene.volume.effects}); // Odtworzenie dźwięku eksplozji.

    // Ukrycie i reset pozycji.
    this.setVisible(false);
    this.setPosition(-300, -300);
    this.inProgress = false;
  }

  // Metoda cyklu życia, wywoływana przy niszczeniu obiektu.
  destroy(fromScene) {
    // Zatrzymanie i zniszczenie obiektów dźwiękowych.
    this.flySound.stop();
    this.flySound.destroy();
    this.explosionSound.destroy();
    super.destroy(fromScene); // Wywołanie metody nadrzędnej.
  }
}

export default UfoSprite;