// Import klasy Bullet, która reprezentuje pojedynczy pocisk.
import Bullet from "../sprites/BulletSprite";

// Definicja klasy BulletsGroup, która dziedziczy po Phaser.Physics.Arcade.Group.
// Odpowiada za zarządzanie pulą pocisków (zarówno gracza, jak i wrogów),
// ich ponowne wykorzystywanie (object pooling) oraz logikę strzelania.
class BulletsGroup extends Phaser.Physics.Arcade.Group {
  // Konstruktor klasy, inicjalizuje grupę pocisków.
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;

    // Właściwości związane ze strzelaniem przez gracza.
    this.shootPossible = true; // Flaga określająca, czy gracz może oddać strzał.
    this.cooldown = 280; // Czas w milisekundach, po którym gracz może oddać kolejny strzał.

    // Określenie typu klasy dla obiektów w tej grupie.
    // Dzięki temu grupa wie, jaki obiekt stworzyć, gdy pula jest pusta.
    this.classType = Bullet;
  }

  // Obsługuje strzelanie przez gracza na podstawie wciśniętych klawiszy.
  handleInput(player) {
    // Sprawdza, czy spacja jest wciśnięta i czy upłynął czas od ostatniego strzału.
    if (!this.scene.cursor.space.isDown || !this.shootPossible) return;

    // Pobranie pocisku z grupy (z puli obiektów). `this.get()` pobiera nieaktywny pocisk
    // lub tworzy nowy, jeśli żaden nie jest dostępny.
    const x = player.x + player.displayWidth / 2;
    const y = player.y;
    const bullet = this.get(x, y);

    if (bullet) {
      // Wywołanie metody 'fire' na pocisku, która go aktywuje i wystrzeliwuje.
      bullet.fire(x, y);
    }

    // Zablokowanie możliwości strzelania.
    this.shootPossible = false;

    // Ustawienie timera, który po upływie czasu 'cooldown' ponownie umożliwi strzał.
    setTimeout(() => (this.shootPossible = true), this.cooldown);
  }

  // Obsługuje strzelanie przez wrogów.
  handleEnemyFire(enemy, chance) {
    // Losowe określenie, czy wróg ma oddać strzał.
    // Np. jeśli `chance` wynosi 100, szansa na strzał wynosi 1/100.
    if (Phaser.Math.Between(0, chance) === 0) {
      // Pobranie pocisku z puli.
      const x = enemy.x;
      const y = enemy.y + enemy.displayHeight / 2;
      const bullet = this.get(x, y);

      if (bullet) {
        // Wywołanie metody 'enemyFire', specyficznej dla pocisków wrogów.
        bullet.enemyFire(x, y);
      }
    }
  }
}

export default BulletsGroup;
