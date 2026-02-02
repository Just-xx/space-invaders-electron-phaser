// Plik definiuje klasę GameScene, która dziedziczy po Phaser.Scene.
// Jest to główna scena gry, w której toczy się cała rozgrywka.

// Importy klas obiektów gry
import PlayerSprite from "../classes/sprites/PlayerSprite.js";
import EnemiesGroup from "../classes/groups/EnemiesGroup.js";
import ObstaclesGroup from "../classes/groups/ObstaclesGroup.js";
import UfoSprite from "../classes/sprites/UfoSprite.js";

// Importy tekstur
import playerImageUrl from "../assets/game/player.png";
import bullet0ImageUrl from "../assets/game/bullet_0.png";
import bullet1ImageUrl from "../assets/game/bullet_1.png";
import enemy0ImageUrl from "../assets/game/enemy_0.png";
import enemy1ImageUrl from "../assets/game/enemy_1.png";
import enemy2ImageUrl from "../assets/game/enemy_2.png";
import enemy3ImageUrl from "../assets/game/enemy_3.png";
import enemy4ImageUrl from "../assets/game/enemy_4.png";
import enemy5ImageUrl from "../assets/game/enemy_5.png";
import enemy6ImageUrl from "../assets/game/enemy_6.png";
import obstaclePartImageUrl from "../assets/game/obstacle_part.png";
import ufoImageUrl from "../assets/game/ufo.png";
import blobImageUrl from "../assets/game/blob.png";

// Importy dźwięków
import explosionSoundUrl from "../assets/game/explosion.wav";
import fastInv1SoundUrl from "../assets/game/fastinvader1.wav";
import fastInv2SoundUrl from "../assets/game/fastinvader2.wav";
import fastInv3SoundUrl from "../assets/game/fastinvader3.wav";
import fastInv4SoundUrl from "../assets/game/fastinvader4.wav";
import invKilledSoundUrl from "../assets/game/invaderkilled.wav";
import ufoLowpitchSoundUrl from "../assets/game/ufo_lowpitch.wav";
import ufoHighpitchSoundUrl from "../assets/game/ufo_highpitch.wav";
import shootSoundUrl from "../assets/game/shoot.wav";

// Inne importy
import StarfiledBg from "../classes/other/StarfieldBg.js";
import LevelController from "../classes/controllers/LevelController.js";
import EscapeMenuComponent from "../classes/components/EscapeMenuComponent.js";

class GameScene extends Phaser.Scene {
  // Konstruktor klasy, pierwsza metoda wywołowana podczas utworzenia instancji klasy.
  constructor() {
    // Przekazanie nazwy klucza sceny do konstruktora klasy z której dziedziczy klasa GameScene.
    super({key: "scene-game"});

    // Deklaracaja zmiennych, które będą wykorzystywane w tej klasie,
    // będą w nich przechowywane główne obiekty gry (sprites)
    this.player;
    this.bullets;
    this.enemies;
    this.ufo;
    this.obstacles;

    // Deklaracja zmiennych, w których będą przechowywane inne ważne obiekty
    // takie jak: cursor (obsługa klawiszy strzałek), scena UI, tło (gwiazdy), klasa odpowiedzielna za obsługę menu pauzy
    this.cursor;
    this.UIScene;
    this.starfiledBg;
    this.escapeMenuNode;

    // Określenie limitu pola gry w osi X, dla łatwiejszego zarządzania.
    this.boundsX = {
      left: 128,
      right: 1792,
    };

    // Określenie limitu pola gry w osi Y.
    this.boundsY = {
      top: 128,
      bottom: 1000,
    };

    // Zmienna odpowiedzialna za zablokowanie toku rozgrywki.
    // Na jej podstawie opisana jest logika, głównej pętli gry (update) oraz zachowaniu obieków gry (sprite'ów).
    // Na początku tok gry odblokowany.
    this.disableProgress = false;

    // Utworzenie obiektu klasy kotrolera poziomów, odpowiedzialnego za zarządzanie danymi związynymi z poziomami.
    this.levelController = new LevelController();

    // Początkowe ustawienia głośności (możliwość zmiany w ustawieniach)
    this.volume = {
      effects: 0.05,
      music: 0.02,
    };
  }

  // Metoda phaser, uruchamiana przy inicjalizowaniu, restarcie, starcie sceny.
  // Posiada możlwiość przekazania początkowych danych (data).
  init(data) {
    // Dla pewności, włączenie głownego toku gry.
    this.disableProgress = false;

    // Sprawdzenie czy scena zostala wystartowana poprzez kliknięcie w konkretny poziom.
    // Jeśli tak, ustawiany jest on jako aktualny w kontrolerze poziomów.
    if (data.level && data.level !== this.levelController.currentLevel)
      this.levelController.setCurrentLevel(data.level);

    // Zarejstrowanie zdarzenia shutdown, wywoływanego, gdy scena jest zamykana.
    this.events.once("shutdown", () => this.shutdown());

    // Pobranie wartości głośności z localStorage.
    this.volume = this.getVolume();
  }

  // Metoda, która pobiera wartości głośności z localStorage.
  // Konwertuje pobrane wartości na typ Float, gdyż w localStorage są przechowywane w formie tekst.
  // Jeśli nie ma zapisanej wartości, używawa domyslnych zdefiniowanych w konstruktorze.
  getVolume() {
    let volumeEffects = window.localStorage.getItem("volume-effects");
    let volumeMusic = window.localStorage.getItem("volume-music");

    if (volumeEffects) volumeEffects = parseFloat(volumeEffects);
    else volumeEffects = this.volume.effects;

    if (volumeMusic) volumeMusic = parseFloat(volumeMusic);
    else volumeMusic = this.volume.music;

    const volume = {
      effects: volumeEffects,
      music: volumeMusic,
    };

    return volume;
  }

  // Metoda Phaser, która wczytuje wszystkie zależności: tekstury oraz dźwięki do sceny.
  preload() {
    // Ładowanie tekstur do sceny
    this.load.image("player", playerImageUrl);
    this.load.image("bullet-type1", bullet1ImageUrl);
    this.load.image("bullet", bullet0ImageUrl);
    this.load.image("enemy-type0", enemy0ImageUrl);
    this.load.image("enemy-type1", enemy1ImageUrl);
    this.load.image("enemy-type2", enemy2ImageUrl);
    this.load.image("enemy-type3", enemy3ImageUrl);
    this.load.image("enemy-type4", enemy4ImageUrl);
    this.load.image("enemy-type5", enemy5ImageUrl);
    this.load.image("enemy-type6", enemy6ImageUrl);
    this.load.image("obstacle-part", obstaclePartImageUrl);
    this.load.image("ufo", ufoImageUrl);
    this.load.image("blob", blobImageUrl);
    StarfiledBg.createStarfieldTexture(this);

    // Ładowanie pików audio do sceny
    this.load.audio("explosion", explosionSoundUrl);
    this.load.audio("shoot", shootSoundUrl);
    this.load.audio("fast-inv1", fastInv1SoundUrl);
    this.load.audio("fast-inv2", fastInv2SoundUrl);
    this.load.audio("fast-inv3", fastInv3SoundUrl);
    this.load.audio("fast-inv4", fastInv4SoundUrl);
    this.load.audio("inv-killed", invKilledSoundUrl);
    this.load.audio("ufo-highpitch", ufoHighpitchSoundUrl);
    this.load.audio("ufo-lowpitch", ufoLowpitchSoundUrl);
  }

  // Metoda Phaser, która jest wywoływana po załadowaniu wszystkich zasobów (metoda preload).
  // Odpowiada za utworzenie i inicjalizację wszystkich obiektów w scenie.
  create() {
    
    // Utworzenie obiektu odpowiedzialnego za obsługe przycisków klawiatury.
    this.cursor = this.input.keyboard.createCursorKeys();

    // Utworzenie lini, które wyznaczają obszar rozgrywk
    this.createBoundiresLines();

    // Utworzenie obiektów sceny i grup tych obiektów
    this.player = new PlayerSprite(this, 1920 / 2, 1080 - 128, this.enemiesBoundsX);
    this.enemies = new EnemiesGroup(this, this.levelController.getCurrentLevel());
    this.ufo = new UfoSprite(this, 100, 100);
    this.obstacles = new ObstaclesGroup(this);

    // Dodanie za pomocą wbudowanej metody Phaser'a koliziji pomiędzy graczem i pociskami a przeciwnikami i ich pociskami.
    // Po wykreyciu kolizji przez silnik wywoływana jest metoda podana jako trzeci argument. 
    this.physics.add.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    this.physics.add.overlap(this.player, this.enemies.bullets, this.playerHit, null, this);

    // Detekcja kolizji pomiędzy graczem i pociskami a ufo i jego pociskami
    this.physics.add.overlap(this.player, this.ufo.bullets, this.playerHit, null, this);
    this.physics.add.overlap(this.player.bullets, this.ufo, this.ufoHit, null, this);

    // Detekcja kolizji pomiędzy "barierami" przed graczem a wszystkimi typami pocisków i przeciwnikami.
    this.physics.add.overlap(this.obstacles, this.enemies.bullets, this.obstacleBulletHit, null, this);
    this.physics.add.overlap(this.obstacles, this.player.bullets, this.obstacleBulletHit, null, this);
    this.physics.add.overlap(this.obstacles, this.enemies, o => o.onHit(), null, this);
    this.physics.add.overlap(this.obstacles, this.ufo.bullets, this.obstacleBulletHit, null, this);

    // Pobranie obiektu sceny odpowiedzialnej za UI i przypisanie do zmiennej dla łatwiejszego zarządzania.
    this.UIScene = this.scene.get("scene-ui");

    // Odświeżenie wartości (życia, wynik, poziom) w scenie UI.
    this.updateUI();

    // Animacja przy starcie sceny (miganie przeciwników itp.)
    this.fadeIn();

    // Utworzenie obiektu tła, który jest animawany dająć iluzję ruchu statku gracza.
    this.starfiledBg = new StarfiledBg(this);

    // Utworzenie obiektu klasy odpowiedzialnej za obsługę menu pauzy. 
    this.escapeMenuNode = new EscapeMenuComponent();
    
    // Obsługa zdarzenia wyjścia z menu pauzy i powrótu do głownego menu:
    // - ukrywa menu pauzy
    // - zatrzymuje sceny: GameScene i UIScene
    this.escapeMenuNode.onReturn(() => {
      this.escapeMenuNode.hide();
      this.UIScene.onReturn();
    });

    // Nasłuchiwanie na wciśniecie klawisza esc.
    // Po wciśnięciu pokazuje/ukrywa menu pauzy.
    this.registerEscapeMenuListener();
  }

  // Metoda odpowiedzialna za nasłuchiwanie na klawisz esc i pokazywanie/ukrywanie tego menu na ekranie.
  registerEscapeMenuListener() {
    // Pobranie obiektu przycisku z metody Phaser'a.
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Nasłuchiwanie na wciśnięcie oraz obsługa.
    this.escapeKey.on("down", () => {
      if (!this.escapeMenuNode.visible) {
        this.escapeMenuNode.show(this);
        this.scene.pause();
      } else {
        this.escapeMenuNode.hide();
        this.scene.resume();
      }
    });
  }

  // Metoda wywoływana, gdy scena jest niszczona, zamykana lub restartowana.
  // Usuwa obiekty w celu zwolnienia pamięci.
  shutdown() {
    // Obiekt przycisku esc.
    this.escapeKey.destroy();

    // Obiekty gry i grupy tych obiektów.
    this.ufo.destroy();
    this.player.destroy();
    this.enemies.destroy();
    this.obstacles.destroy();

    // Usunięcie wszystkich zaplanowanych zdarzeń czasowych, aby zapobiec błędom po zamknięciu sceny.
    this.time.removeAllEvents();
  }

  // Metoda obsługująca odświeżenie i przekazanie danych do sceny UI.
  // Jeżeli scena UI jest aktywna to dane są przekazywane,
  // w przeciwnym razie podejmowana jest kolejna próba po 50 ms.
  updateUI(additionalData) {
    if (this.UIScene && this.UIScene.scene.isActive()) {
      this.UIScene.updateUI({
        lives: this.player.lives,
        score: this.player.score,
        level: this.levelController.currentLevel,
        ...additionalData,
      });
    }
    else {
      this.time.delayedCall(50, () => this.updateUI());
    }
  }

  // Metoda wywłowana, gdy gracz ukończy poziom.
  // W kontrolerze poziomów ustawiany jest nastęny poziom.
  // Postęp zostaje zablokowany, do momentu przejścia do następnego poziomu.
  // Wysyłane są dane do sceny UI, która pokazuje widok ukończonego poziomu.
  levelComplete() {
    this.levelController.nextLevel();
    this.disableProgress = true;
    this.updateUI({levelComplete: true});
  }

  // Metoda wywoływana, gdy gracz ukończy wszystkie poziomy.
  // Postęp zostaje zablokowany, do momentu wybrania kolejnej akcji.
  // Wysyłane są dane do sceny UI, która pokazuje widok ukończenia gry.
  gameWon() {
    this.disableProgress = true;
    this.levelController.setCurrentAsPassed();
    this.updateUI({gameWon: true});
  }

  // Metoda wywoływana, gdy gracz przegra poziom.
  // Postęp zostaje zablokowany, do momentu wybrania kolejnej akcji.
  // Wysyłane są dane do sceny UI, która pokazuje widok przgranej gry.
  // Wywołwyane są metody na obiektach "informujące" je, że gra została przegrana.
  gameOver() {
    this.disableProgress = true;
    this.enemies.gameOver();
    this.player.gameOver();
    this.updateUI();
  }

  // Metoda, która wywołuje się, gdy przeciwnik zostanie trafiony przez pocisk.
  // Wywołuje metodą na odpowednim przeciwniku, która jest odpowiedzialna za usunięcie go lub zmniejszenie jego życia.
  // Jeżeli zostaną zabici wszscy przeciwnicy,
  // wywołwyana jest metoda levelComplete lub gameWon jeżeli był to ostatni poziom gry.
  enemyHit(bullet, enemy) {
    if (this.disableProgress) return;
    bullet.onHit();
    const enemyKilled = enemy.onHit(10);

    if (enemyKilled) {
      this.enemies.speedup();
      const scoreAmount = (Math.floor(enemy.maxHealth / 10) + 1) * 10;
      this.player.addScore(scoreAmount);
      this.updateUI();
    }

    // all enemies eliminated
    if (this.enemies.getLength() <= 0 && this.levelController.currentLevel < 15) this.levelComplete();
    else if (this.enemies.getLength() <= 0 && this.levelController.currentLevel >= 15) this.gameWon();
  }

  // Metoda, która wywołuje się, gdy statek ufo zostanie trafiony przez pocisk gracza.
  // Niszczy pocisk oraz statek ufo wywołująco odpowiednie metody tych obiektów.
  ufoHit(bullet, ufo) {
    bullet.onHit();
    ufo.onHit();
  }

  // Metoda, która wywołuje się, gdy gracz zostanie trafiony przez pocisk.
  // Odejmuje życia lub kończy rozgrywkę, gdy życia spadną poniżej 0;
  // Nadaje efekt "kary" - na chwilę gracz nie może się ruszać.
  playerHit(player, bullet) {
    if (this.disableProgress) return;

    bullet.onHit();
    player.onHit(bullet);
    this.updateUI();

    if (player.lives <= 0) {
      this.gameOver();
    }
  }

  // Sprawdzenie czy fala nie doszła już do współrzędnych Y gracza.
  // Jeśli tak, to gra jest przegrana.
  checkInvasion() {
    if (this.disableProgress) return;
    if (this.player.lives <= 0) return;
    const enemies = this.enemies.getChildren();
    const lastEnemy = enemies.at(-1);
    if (enemies.length && this.player.y <= lastEnemy.y + lastEnemy.displayHeight) this.gameOver();
  }

  // Metoda, która wywołuje się, gdy klocek bariery zostanie trafiony przez pocisk.
  // Usuwa pocisk i trafiony klocek bariery.
  obstacleBulletHit(obstaclePart, bullet) {
    obstaclePart.onHit(obstaclePart);
    bullet.onHit();
  }

  // Główna pętla gry, wywoływana w każdej klatce.
  // Wywołuje metody odpowiedzialne za odświeżanie przeciwników i tła (gwiazd)
  // oraz sprawdza czy przeciwnicy nie doszli do gracza.
  update(time, delta) {
    this.enemies.update(time, delta);
    this.checkInvasion();
    this.starfiledBg.update(time, delta);
  }

  // Animacja poszczególnych obiektów gry, gdy scena jest uruchamiana
  // Powoduje efekt migania/ładowania.
  fadeIn() {

    // Na chwile blokowany jest postep.
    this.disableProgress = true;

    // Opis animacji rokiety gracza.
    this.tweens.add({
      targets: [this.player],
      alpha: {from: 1, to: 0.2},
      duration: 150,
      ease: "EaseIn",
      yoyo: true,
      repeat: 7,
    });

    // Pobranie obiektów przeciwników do zmiennej.
    const enemies = this.enemies.getChildren();
    enemies.forEach(e => e.setAlpha(0));

    // Opis animacji przeciwników.
    this.tweens.add({
      targets: enemies,
      alpha: {from: 0.5, to: 0.2},
      duration: 150,
      ease: "EaseIn",
      yoyo: true,
      repeat: 6,
    });

    // Po 2400 ms pełne pokazanie przeciwników i odblokowanie postępu - w tym momencie rozgrywka się zaczyna.
    this.time.delayedCall(2400, () => {
      this.tweens.add({
        targets: enemies,
        alpha: {from: 0.2, to: 1},
        duration: 150,
        ease: "EaseIn",
        onComplete: () => {
          this.disableProgress = false;
        },
      });
    });
  }

  // Metoda, która tworzy linie po bokach określające pole rozgrywki.
  createBoundiresLines() {
    // Utworzenie obiektu graphics umożliwiającego tworzenie prostych kształtów na ekranie.
    const graphicsBoundiresLines = this.add.graphics();
    // Utworzenie lewej lini
    graphicsBoundiresLines.lineStyle(1, 0xfffffff, 0.05);
    graphicsBoundiresLines.moveTo(this.boundsX.left, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.left, this.boundsY.bottom);
    // Utworzenie prawej lini
    graphicsBoundiresLines.moveTo(this.boundsX.right, this.boundsY.top);
    graphicsBoundiresLines.lineTo(this.boundsX.right, this.boundsY.bottom);
    graphicsBoundiresLines.strokePath();
  }
}

export default GameScene;
