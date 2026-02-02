// Importowanie głównych arkuszy stylów.
import "./styles/main.css";
import "./styles/media.css";

// Importowanie klas scen i kontrolera głownego menu.
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";
import MainMenuController from "./classes/controllers/MainMenuController.js";

// Pobranie z dokumentu HTML elementu <canvas>, na którym będzie renderowana gra.
const gameCanvas = document.querySelector("#game-canvas");

// Główny obiekt konfiguracyjny dla silnika Phaser.
// Definiuje on kluczowe parametry gry, takie jak: wymiary, fizyka, sceny i skalowanie.
const config = {
  type: Phaser.WEBGL,
  width: 1920, // szerokość elementu `canvas`
  height: 1080, // wysokość elementu `canvas`
  canvas: gameCanvas,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 200},
      debug: false,
    },
  },
  scene: [UIScene, GameScene], // Tablica ze wszystkimi scenami, które gra będzie używać.
  scale: {
    mode: Phaser.Scale.FIT, // Tryb skalowania: zachowaj proporcje i dopasuj do kontenera.
    autoCenter: Phaser.Scale.CENTER_BOTH, // Automatycznie wyśrodkuj płótno na stronie.
    autoRound: true,
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  audio: {
    disableWebAudio: false,
    noAudio: false,
  }
};

// Utworzenie nowej instancji gry Phaser na podstawie powyższej konfiguracji.
const game = new Phaser.Game(config);

// Utworzenie instancji kontrolera menu głównego.
const mainMenuController = new MainMenuController(game);

// Przypisanie instancji gry do globalnego obiektu 'window' dla ułatwienia debugowania.
window.game = game;

// Rozszerzenie obiektu gry o własną metodę w celu jej animacji, gdy się ukazuje.
game.showGameCanvas = () => {
  const gameCanvas = document.querySelector("#game-canvas");
  gameCanvas.style.opacity = 1;
};

// Zdefiniowanie akcji, która wykona się po kliknięciu przycisku start w menu głównym.
mainMenuController.onStart(() => {
  game.showGameCanvas(); // Pokaż `canvas` gry.
  game.scene.start("scene-game"); // Uruchom scenę z logiką gry.
  game.scene.start("scene-ui", mainMenuController); // Uruchom scenę z interfejsem użytkownika (UI) z przekazaniem do tej sceny obieku kontrolera głównego menu
});