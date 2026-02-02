// Plik defniuje klasę UIScene, która dziedziczy po Phaser.Scene.
// Jest to scena pomocnicza, działająca równolegle do GameScene.
// Odpowiada za wyświetlanie interfejsu użytkownika (życia, wynik, poziom)
// oraz za obsługę widoków takich jak ekran końca gry, ukończenia poziomu czy pauzy.

// Import zależności:
// - Scene: klasa bazowa z której dziedziczy UIScene.
// - Komponenty: klasy odpowiedzialne za logikę i wygląd poszczególnych widoków (ekranów).
import {Scene} from "phaser";
import GameOverComponent from "../classes/components/GameOverComponent";
import LevelCompleteComponent from "../classes/components/LevelCompleteComponent";
import GameWonComponent from "../classes/components/GameWonComponent";

class UIScene extends Scene {
  // Konstruktor klasy, inicjalizuje podstawowe właściwości sceny.
  constructor() {
    // Wywołanie konstruktora klasy nadrzędnej z konfiguracją.
    // `key`: unikalny identyfikator sceny.
    // `active: true`: scena jest automatycznie aktywowana przy starcie.
    super({key: "scene-ui", active: true});

    // Inicjalizacja początkowych wartości dla wyświetlanych danych.
    this.score = 0;
    this.lives = 3;
    this.level = 1;

    // Deklaracja referencji do innych scen i komponentów.
    this.mainMenu;
    this.gameScene;

    // Definicja odstępu między elementami UI na górnym pasku.
    this.elementsSpacing = 256;
  }

  // Metoda cyklu życia Phaser, wywoływana przy inicjalizacji sceny.
  // Używana do pobrania referencji i ustawienia zdarzeń.
  init(mainMenu) {
    // Zapisanie referencji do sceny menu głównego.
    this.mainMenu = mainMenu;
    // Wstrzymanie muzyki z menu głównego, jeśli gra się rozpoczyna.
    if (mainMenu.music) mainMenu.music.pause();
    // Rejestracja jednorazowego zdarzenia 'shutdown', które wywoła metodę `shutdown` tej klasy.
    this.events.once("shutdown", () => this.shutdown());
  }

  // Metoda cyklu życia Phaser, obecnie nieużywana.
  // Służy do wczytywania zasobów przed utworzeniem sceny.
  preload() {}

  // Metoda cyklu życia Phaser, wywoływana po załadowaniu zasobów.
  // Tworzy wszystkie obiekty i komponenty interfejsu użytkownika.
  create() {
    // Pobranie referencji do aktywnej sceny gry.
    const gameScene = this.scene.get("scene-game");
    this.gameScene = gameScene;

    // Ustawienie koordynatów dla elementów UI.
    const centerX = this.scale.width / 2;
    const centerTopBarY = gameScene.boundsY.top / 2;

    // Utworzenie tekstu wyświetlającego wynik.
    this.scoreText = this.add.text(centerX, centerTopBarY, `Wynik: ${this.score}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });
    this.scoreText.setOrigin(0.5, 0.5); // Ustawienie punktu centralnego tekstu.

    // Utworzenie tekstu wyświetlającego liczbę żyć.
    this.livesText = this.add.text(centerX - this.elementsSpacing, centerTopBarY, `Życia: ${this.lives}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });
    this.livesText.setOrigin(0.5, 0.5);

    // Utworzenie tekstu wyświetlającego aktualny poziom.
    this.levelText = this.add.text(centerX + this.elementsSpacing, centerTopBarY, `Poziom: ${this.level}`, {
      font: "600 26px Orbitron",
      fill: "#e3e3e3",
    });
    this.levelText.setOrigin(0.5, 0.5);

    // Pobranie aktualnego poziomu z kontrolera poziomów w GameScene.
    this.level = gameScene.levelController.getCurrentLevel();

    // Inicjalizacja komponentu ekranu końca gry (Game Over).
    this.gameOverNode = new GameOverComponent();
    this.gameOverNode.onRestart(() => this.restartLevel()); // Rejestracja akcji restartu.
    this.gameOverNode.onReturn(() => this.onReturn()); // Rejestracja akcji powrotu do menu.

    // Inicjalizacja komponentu ekranu ukończenia poziomu.
    this.levelCompleteComponent = new LevelCompleteComponent();
    this.levelCompleteComponent.onNextLevelClick(() => this.nextLevelStart()); // Rejestracja akcji przejścia do następnego poziomu.
    this.levelCompleteComponent.onReturn(() => this.onReturn());

    // Inicjalizacja komponentu ekranu wygranej gry.
    this.gameWonComponent = new GameWonComponent();
    this.gameWonComponent.onReturn(() => this.onReturn());
  }

  // Główna metoda do aktualizacji danych w UI, wywoływana z GameScene.
  updateUI(data) {
    if (!this.scoreText) return; // Zabezpieczenie przed wywołaniem, gdy teksty nie są jeszcze utworzone.

    // Aktualizacja wewnętrznych właściwości i tekstów na ekranie.
    this.score = data.score;
    this.lives = data.lives;
    this.level = data.level;

    this.scoreText.setText(`Wynik: ${this.score}`);
    this.livesText.setText(`Życia: ${this.lives}`);
    this.levelText.setText(`Poziom: ${this.level}`);

    // Logika warunkowa do wyświetlania odpowiednich komponentów.
    if (this.lives <= 0) this.showGameOverComponent();

    if (data.levelComplete) {
      this.showLevelComponent();
      this.level = this.level - 1; // Korekta numeru poziomu na ekranie ukończenia.
      this.levelText.setText(`Poziom: ${this.level}`);
    }

    if (data.gameWon) this.showGameWonComponent();
  }

  // Metoda do animacji pojawiania się elementów UI.
  fadeIn() {
    this.tweens.add({
      targets: [this.scoreText, this.levelText, this.livesText],
      alpha: {from: 0, to: 1},
      duration: 2400,
      ease: "EaseIn",
    });
  }

  // Wyświetla komponent ekranu końca gry i przekazuje do niego dane.
  showGameOverComponent() {
    this.gameOverNode.setLevel(this.level);
    this.gameOverNode.setScore(this.score);
    this.gameOverNode.show();
  }

  // Wyświetla komponent ekranu ukończenia poziomu i przekazuje do niego dane.
  showLevelComponent() {
    this.levelCompleteComponent.setLevel(this.level - 1);
    this.levelCompleteComponent.setScore(this.score);
    this.levelCompleteComponent.show();
  }

  // Wyświetla komponent ekranu wygranej gry.
  showGameWonComponent() {
    this.gameWonComponent.show();
  }

  // Rozpoczyna następny poziom.
  nextLevelStart() {
    this.levelCompleteComponent.hide();
    this.gameScene.scene.restart({}); // Restartuje scenę gry.
    this.scene.restart(this.mainMenu); // Restartuje scenę UI.
  }

  // Restartuje aktualny poziom.
  restartLevel() {
    this.gameOverNode.hide();
    this.gameScene.scene.restart({});
    this.scene.restart(this.mainMenu);
  }

  // Obsługuje powrót do menu głównego.
  onReturn() {
    // Ukrycie wszystkich potencjalnie widocznych komponentów.
    this.mainMenu.show();
    this.gameOverNode.hide();
    this.levelCompleteComponent.hide();
    this.gameWonComponent.hide();

    // Emisja zdarzenia 'return' dla ewentualnych nasłuchujących.
    this.events.emit("return");

    // Zatrzymanie i ukrycie sceny gry i UI.
    this.scene.setVisible(false, "scene-game");
    this.scene.setVisible(false, "scene-ui");

    this.scene.stop("scene-ui");
    this.scene.stop("scene-game");
  }

  // Metoda cyklu życia Phaser, wywoływana przy zamykaniu sceny.
  // Odpowiada za czyszczenie i niszczenie obiektów, aby zwolnić pamięć.
  shutdown() {
    this.levelText.destroy();
    this.scoreText.destroy();
    this.livesText.destroy();
  }
}

export default UIScene;
