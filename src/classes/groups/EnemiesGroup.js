// Import klas EnemySprite i BulletsGroup.
import EnemySprite from "../sprites/EnemySprite";
import BulletsGroup from "./BulletsGroup";

// Definicja klasy EnemiesGroup, która dziedziczy po Phaser.Physics.Arcade.Group.
// Jest to centralna klasa zarządzająca całą formacją wrogów, ich ruchem, strzelaniem i "muzyką" w tle.
class EnemiesGroup extends Phaser.Physics.Arcade.Group {
  // Konstruktor klasy, inicjalizuje grupę wrogów na podstawie konfiguracji poziomu.
  constructor(scene, level) {
    super(scene.physics.world, scene);
    this.scene = scene;

    // Ustawienia początkowe formacji.
    this.spacingX = 32; // Odstęp poziomy między wrogami.
    this.spacingY = 16; // Odstęp pionowy między wrogami.

    this.startX = this.scene.boundsX.left; // Początkowa pozycja X.
    this.startY = this.scene.boundsY.top; // Początkowa pozycja Y.

    // Właściwości pobierane z obiektu 'level'.
    this.shootChance = level.shootChance; // Szansa na strzał.
    this.startVelocity = level.speed || 100; // Początkowa prędkość.
    this.velocity = this.startVelocity; // Aktualna prędkość.
    this.levelScheme = level.scheme; // Schemat (układ) wrogów.

    this.depthLevel = 0; // Licznik, ile razy formacja przesunęła się w dół.
    this.lastVelocity = this.startVelocity; // Zapasowa prędkość na czas uruchamiania, gdy przeciwnicy są w miejscu.
    this.canShoot = false; // Flaga, czy wrogowie mogą strzelać.

    // Grupa pocisków dla całej formacji.
    this.bullets = new BulletsGroup(this.scene, "down", true, "bullet-type1");

    this.createEnemies(); // Utworzenie wrogów na podstawie schematu.

    // Inicjalizacja dźwięków tworzących charakterystyczną "muzykę" w grze.
    this.fastInv1Sound = this.scene.sound.add("fast-inv1");
    this.fastInv2Sound = this.scene.sound.add("fast-inv2");
    this.fastInv3Sound = this.scene.sound.add("fast-inv3");
    this.fastInv4Sound = this.scene.sound.add("fast-inv4");

    // Zmienne do zarządzania odtwarzaniem "muzyki".
    this.musicState = 1;
    this.timeToPlayNote = 0;
  }

  // Metoda odtwarzająca sekwencję dźwięków, której tempo zależy od prędkości wrogów.
  playSong(time, delta) {
    if (this.scene.disableProgress) return;

    this.timeToPlayNote -= delta;
    if (this.timeToPlayNote > 0) return;

    // Odtwarzanie jednego z czterech dźwięków w sekwencji.
    switch (this.musicState) {
      case 1:
        this.fastInv1Sound.play({volume: this.scene.volume.effects * 10});
        break;
      case 2:
        this.fastInv2Sound.play({volume: this.scene.volume.effects * 10});
        break;
      case 3:
        this.fastInv3Sound.play({volume: this.scene.volume.effects * 10});
        break;
      case 4:
        this.fastInv4Sound.play({volume: this.scene.volume.effects * 10});
        break;
    }

    // Wywołanie animacji (odwrócenia tekstury) u wszystkich wrogów w rytm "muzyki".
    this.getChildren().forEach(e => e.flip());

    // Obliczenie czasu do następnego "uderzenia".
    this.timeToPlayNote = 90000 / this.velocity;
    this.musicState++;
    if (this.musicState > 4) this.musicState = 1; // Zapętlenie sekwencji.
  }

  // Główna pętla aktualizacji dla grupy wrogów.
  update(time, delta) {
    this.playSong(time, delta); // Odtwarzanie "muzyki".
    this.handleBoundsCollsion(); // Sprawdzenie kolizji z krawędziami.
    if (this.canShoot && this.getChildren().length) this.autoShooting(); // Losowe strzelanie.

    // Logika pauzowania i wznawiania ruchu formacji.
    if (!this.getChildren().length) return;
    const enemiesVelocity = this.getChildren()[0].body.velocity.x;

    if (this.scene.disableProgress && enemiesVelocity !== 0) {
      this.lastVelocity = enemiesVelocity;
      this.getChildren().forEach(e => e.setVelocityX(0));
      this.canShoot = false;
    }

    if (!this.scene.disableProgress && enemiesVelocity === 0) {
      this.getChildren().forEach(e => e.setVelocityX(this.lastVelocity));
      this.canShoot = true;
    }
  }

  // Sprawdza, czy którykolwiek z wrogów dotarł do krawędzi pola gry.
  handleBoundsCollsion() {
    this.getChildren().forEach(child => {
      if (child.x + child.displayWidth >= this.scene.boundsX.right && child.body.velocity.x > 0) {
        this.setVelocityX(-this.velocity); // Zmiana kierunku całej formacji.
        this.moveDown(); // Przesunięcie formacji w dół.
      } else if (child.x <= this.scene.boundsX.left && child.body.velocity.x < 0) {
        this.setVelocityX(this.velocity);
        this.moveDown();
      }
    });
  }

  // Przesuwa całą formację o jeden krok w dół i zwiększa jej prędkość.
  moveDown() {
    if (this.scene.disableProgress) return;
    this.depthLevel++;

    this.getChildren().forEach(child => {
      const newY = child.y + this.lastEnemyDisplayHeight + this.spacingY;
      // Płynna animacja przejścia w dół.
      this.scene.tweens.add({
        targets: child,
        y: newY,
        x: child.x,
        duration: 80,
        ease: "Power2",
      });
    });
    this.velocity += 15; // Zwiększenie prędkości po każdym zejściu w dół.
  }

  // Losowo wybiera jednego wroga z formacji i daje mu szansę na strzał.
  autoShooting() {
    const childs = this.getChildren();
    const randomEnemyIndex = Phaser.Math.Between(0, childs.length - 1);
    const chance = this.shootChance;
    this.bullets.handleEnemyFire(childs[randomEnemyIndex], chance);
  }

  // Metoda wywoływana przy końcu gry.
  gameOver() {
    this.canShoot = false;
    this.scene.disableProgress = true;
  }

  // Zwiększa prędkość formacji (wywoływane po zniszczeniu wroga).
  speedup() {
    if (this.getChildren().length <= 0) return;
    const enemyVelocity = this.getChildren()[0].body.velocity.x;
    this.velocity += 5;

    // Ustawia nową, zwiększoną prędkość z zachowaniem aktualnego kierunku.
    if (enemyVelocity < 0) this.setVelocityX(-this.velocity);
    else this.setVelocityX(this.velocity);
  }

  // Tworzy całą formację wrogów na podstawie schematu.
  createEnemies() {
    // Inicjalizacja zmiennych pomocniczych do pozycjonowania.
    this.lastEnemyY = 0;
    this.lastEnemyX = 0;
    this.lastEnemyDisplayWidth = 0;
    this.lastEnemyDisplayHeight = 0;
    this.lastRowMaxY = 0;

    // Pętle iterujące po schemacie 2D i tworzące wrogów.
    for (let i = 0; i < this.levelScheme.length; i++) {
      for (let j = 0; j < this.levelScheme[i].length; j++) {
        this.addEnemy(this.levelScheme[i][j], i, j);
      }
    }

    this.centerEnemies(); // Wycentrowanie wierszy po utworzeniu wszystkich wrogów.
  }

  // Dodaje pojedynczego wroga do formacji.
  addEnemy(enemyInfo, i, j) {
    const type = enemyInfo[0];
    const health = enemyInfo[1];

    let x = this.startX;
    let y = this.startY;

    // Obliczenie pozycji nowego wroga na podstawie poprzedniego.
    if (j === 0 && i !== 0) {
      y = this.lastRowMaxY + this.spacingY;
    } else if (j !== 0) {
      x = this.lastEnemyDisplayWidth + this.lastEnemyX + this.spacingX;
      y = this.lastEnemyY;
    }

    const enemy = new EnemySprite(this.scene, x, y, type, health);
    this.add(enemy);

    // Zapisanie pozycji i wymiarów ostatnio dodanego wroga.
    this.lastEnemyDisplayWidth = enemy.displayWidth;
    this.lastEnemyDisplayHeight = enemy.displayHeight;
    this.lastEnemyX = enemy.x;
    this.lastEnemyY = enemy.y;
    if (y + enemy.displayHeight > this.lastRowMaxY) this.lastRowMaxY = y + enemy.displayHeight;

    enemy.body.allowGravity = false;
    enemy.setVelocityX(this.startVelocity);
  }

  // Centruje grupę wrogów, aby formacja była wyrównana.
  centerEnemies() {
    let xBound = 0;
    const enemies = this.getChildren();

    // Znalezienie najszerszego wiersza.
    enemies.forEach(e => {
      if (e.x + e.displayWidth > xBound) xBound = e.x + e.displayWidth;
    });

    // Odtworzenie struktury z płaskiej listy wrogów.
    let row = 0;
    let column = 0;
    let enemiesRow = [];
    let enemiesStructure = [];
    enemies.forEach((e, i) => {
      enemiesRow.push(e);
      column++;
      if (column === this.levelScheme[row].length) {
        enemiesStructure.push(enemiesRow);
        enemiesRow = [];
        column = 0;
        row++;
      }
    });

    // Przesunięcie krótszych wierszy, aby były wycentrowane względem najszerszego.
    enemiesStructure.forEach(eRow => {
      const lastEnemyInRow = eRow.at(-1);
      const lastsEnemyMaxX = lastEnemyInRow.x + lastEnemyInRow.displayWidth;
      if (lastsEnemyMaxX < xBound) {
        const diff = (xBound - lastsEnemyMaxX) / 2;
        eRow.forEach(e => (e.x = e.x + diff));
      }
    });
  }

  // Metoda cyklu życia, wywoływana przy niszczeniu grupy.
  destroy() {
    // Zniszczenie obiektów dźwiękowych, aby zwolnić pamięć.
    this.fastInv1Sound.destroy();
    this.fastInv2Sound.destroy();
    this.fastInv3Sound.destroy();
    this.fastInv4Sound.destroy();
    super.destroy();
  }
}

export default EnemiesGroup;
