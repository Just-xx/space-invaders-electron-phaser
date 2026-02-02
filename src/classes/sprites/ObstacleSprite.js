// Definicja klasy ObstacleSprite, która dziedziczy po Phaser.Physics.Arcade.Sprite.
// Reprezentuje pojedynczy, zniszczalny fragment osłony (przeszkody).
class ObstacleSprite extends Phaser.Physics.Arcade.Sprite {
  // Konstruktor klasy, inicjalizuje fragment osłony.
  constructor(scene, x, y) {
    super(scene, x, y, "obstacle-part");

    // Dodanie obiektu do sceny i fizyki Phrasera.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Ustawienia ciała fizycznego i wyglądu.
    this.body.allowGravity = false; // Wyłączenie grawitacji.
    this.setScale(0.7);

    // Definicja cząsteczek emitowanych przy trafieniu.
    this.hitParticles = this.scene.add.particles(0, 0, "bullet-type1", {
      speed: {min: 150, max: 350},
      angle: {min: 0, max: 360},
      scale: {start: 0.05, end: 0},
      lifespan: {min: 100, max: 300},
      gravityY: 0,
      blendMode: "ADD",
      tint: [0x80ecff, 0x389deb, 0xf9180ff], // Niebieskawy odcień dla osłony.
      emitting: false,
    });

    // Inicjalizacja dźwięku trafienia z podwyższoną tonacją.
    this.hitSound = this.scene.sound.add("inv-killed").setDetune(2500);
  }

  // Metoda wywoływana, gdy fragment zostanie trafiony.
  onHit() {
    // Emisja cząsteczek w miejscu trafienia.
    this.hitParticles.explode(5, this.x + this.displayWidth / 2, this.y + this.displayHeight / 2);
    // Odtworzenie dźwięku trafienia.
    this.hitSound.play({volume: this.scene.volume.effects / 2});
    // Zniszczenie fragmentu osłony.
    this.destroy();
  }

  // Metoda cyklu życia, wywoływana przy niszczeniu obiektu.
  destroy(fromScene) {
    // Zniszczenie obiektu dźwiękowego, aby zwolnić pamięć.
    this.hitSound.destroy();
    super.destroy(fromScene);
  }
}

export default ObstacleSprite;
