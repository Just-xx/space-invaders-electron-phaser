// Import klasy ObstacleSprite, która reprezentuje pojedynczy fragment osłony.
import ObstacleSprite from "../sprites/ObstacleSprite";

// Definicja klasy ObstaclesGroup, która dziedziczy po Phaser.Physics.Arcade.Group.
// Zarządza tworzeniem, pozycjonowaniem i stanem wszystkich osłon (bunkrów) w grze.
class ObstaclesGroup extends Phaser.Physics.Arcade.Group {
  // Konstruktor klasy, inicjalizuje grupę osłon.
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.createGroups(); // Wywołanie metody tworzącej osłony.
  }

  // Tworzy pojedynczą osłonę z mniejszych fragmentów.
  createCluster() {
    let cluster = []; // Tablica przechowująca wszystkie fragmenty jednej osłony.

    // Utworzenie tymczasowego fragmentu w celu uzyskania wymiarów.
    const obstacleSprite = this.addPart(0, 0);
    const obstacleWidth = obstacleSprite.displayWidth;
    const obstacleHeight = obstacleSprite.displayHeight;
    cluster.push(obstacleSprite);

    // Pętle tworzące siatkę fragmentów 5x5.
    let y, x;
    for (let i = 0; i <= 4; i++) {
      x = obstacleWidth * i;
      for (let j = 0; j <= 4; j++) {
        // Warunki "rzeźbią" kształt bunkra, pomijając tworzenie niektórych fragmentów.
        if (j === 0 && i === 0) continue;
        if (j === 0 && i === 4) continue;
        if (j === 3 && i === 2) continue;
        if (j === 4 && i <= 3 && i >= 1) continue;
        y = obstacleHeight * j;
        const part = this.addPart(x, y);
        cluster.push(part);
      }
    }

    // Usunięcie tymczasowego fragmentu.
    cluster[0].destroy();
    cluster.shift();

    return cluster; // Zwraca tablicę fragmentów tworzących jedną osłonę.
  }

  // Metoda pomocnicza do tworzenia pojedynczego fragmentu osłony.
  addPart(x, y) {
    const obstacleSprite = new ObstacleSprite(this.scene, x, y);
    this.add(obstacleSprite); // Dodanie do grupy fizyki.
    obstacleSprite.body.allowGravity = false;
    return obstacleSprite;
  }

  // Przesuwa całą osłonę (klaster) w odpowiednie miejsce na ekranie.
  moveToPostion(cluster, pos) {
    // Obliczenie szerokości i wysokości całej osłony.
    const obstacleClusterWidth = cluster[0].displayWidth * 5;
    const obstacleClusterHeight = cluster[0].displayHeight * 5;

    // Obliczenie docelowej pozycji X i Y dla osłony.
    const spacingX = this.scene.scale.width / 3 - obstacleClusterWidth * 1.5;
    const spacingY = this.scene.player.y - obstacleClusterHeight - 64; // Pozycja nad graczem.

    // Przesunięcie każdego fragmentu w klastrze.
    cluster.forEach(part => {
      part.x = part.x + spacingX * pos;
      part.y = part.y + spacingY;
    });
  }

  // Główna metoda tworząca wszystkie grupy osłon.
  createGroups() {
    // Utworzenie trzech osłon i zapisanie ich w tablicy.
    this.clusters = [this.createCluster(), this.createCluster(), this.createCluster()];
    // Pozycjonowanie każdej z trzech osłon na ekranie.
    this.clusters.forEach((cluster, i) => this.moveToPostion(cluster, i + 1));
  }

  // Metoda do obsługi trafienia
  onHit(part) {
    part.destroy();
  }
}

export default ObstaclesGroup;
