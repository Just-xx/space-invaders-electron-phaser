// Import komponentów dla widoków "Poziomy" i "Ustawienia" oraz pliku audio.
import LevelsViewComponent from "../components/LevelsViewComponent";
import songUrl from "../../assets/menu/spaceinvaders_song.wav";
import SettingsViewComponent from "../components/SettingsViewComponent";

// Definicja klasy MainMenuController.
// Ta klasa nie dziedziczy po żadnej klasie Phaser. Jest to czysty kontroler JavaScript,
// który zarządza interfejsem menu głównego zbudowanym w HTML/CSS.
// Działa jako most pomiędzy elementami DOM a logiką gry w Phaser.
class MainMenuController {
  // Konstruktor klasy, inicjalizuje menu główne.
  constructor(game) {
    // Inicjalizacja komponentów-kontrolerów dla pod-widoków.
    this.levelsViewComponent = new LevelsViewComponent(this, game);
    this.settingsViewComponent = new SettingsViewComponent(this, game);

    // Pobranie referencji do kluczowych elementów DOM.
    this.menuBtns = document.querySelectorAll(".menu-btn");
    this.heroImgWrapper = document.querySelector(".hero-menu-img-wrapper");
    this.titleWrapper = document.querySelector(".title-wrapper");
    this.menuBtnsWrapper = document.querySelector(".menu-btns-wrapper");
    this.game = document.querySelector("#game"); // Kontener gry Phaser.

    // Przyciski menu.
    this.startBtn = document.querySelector("#menu-start-btn");
    this.updateLevel(); // Aktualizacja tekstu na przycisku startowym.

    this.levelsBtn = document.querySelector("#menu-levels-btn");
    this.settingsBtn = document.querySelector("#menu-settings-btn");

    // Dodanie nasłuchiwaczy zdarzeń do przycisków.
    this.startBtn.addEventListener("click", () => this.hide());
    this.levelsBtn.addEventListener("click", () => this.handleLevelsClick());
    this.settingsBtn.addEventListener("click", () => this.handleSettingsClick());

    // Inicjalizacja i odtwarzanie muzyki w menu.
    this.music = new Audio(songUrl);
    this.music.loop = true;
    this.music.volume = this.settingsViewComponent.getVolume().music;
    this.music.play();
  }

  // Aktualizuje tekst na przycisku startowym, wyświetlając numer bieżącego poziomu.
  updateLevel() {
    this.startBtn.innerHTML = `Start <span class="level-text">(Poziom - ${
      window.localStorage.getItem("current-level") || 1
    })</span><i class="ri-play-line"></i>`;
  }

  // Metoda do animowanego ukrywania menu głównego.
  hide(opacity = 0.98) {
    // Używa transformacji CSS i opóźnień (setTimeout) do stworzenia efektu kaskadowego.
    this.heroImgWrapper.style.transform = "translateX(100%) rotate(25deg)";
    this.heroImgWrapper.style.opacity = "0";

    setTimeout(() => {
      this.titleWrapper.style.transform = "translateY(-100%)";
      this.titleWrapper.style.opacity = "0";
    }, 150);

    setTimeout(() => {
      this.menuBtnsWrapper.style.transform = "translateY(100%)";
      this.menuBtnsWrapper.style.opacity = "0";
    }, 300);

    // Stopniowa zmiana tła kontenera gry.
    setTimeout(() => {
      this.game.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }, 450);

    // Wyłączenie interakcji z przyciskami po ich ukryciu.
    this.menuBtns.forEach(btn => (btn.style.pointerEvents = "none"));
  }

  // Metoda do animowanego pokazywania menu głównego (odwrócenie logiki z `hide`).
  show() {
    this.updateLevel();
    this.menuBtns.forEach(btn => (btn.style.pointerEvents = "auto"));

    this.heroImgWrapper.style.transform = "translateX(0%) rotate(0deg)";
    this.heroImgWrapper.style.opacity = "1";

    setTimeout(() => {
      this.titleWrapper.style.transform = "translateY(0%)";
      this.titleWrapper.style.opacity = "1";
    }, 150);

    setTimeout(() => {
      this.menuBtnsWrapper.style.transform = "translateY(0%)";
      this.menuBtnsWrapper.style.opacity = "1";
    }, 300);

    setTimeout(() => {
      this.game.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    }, 450);

    // Wznowienie muzyki, jeśli była wstrzymana.
    if (this.music.paused) {
      this.music.play();
      this.music.currentTime = 0;
    }
  }

  // Metoda pozwalająca na podpięcie zewnętrznej funkcji do zdarzenia kliknięcia przycisku "Start".
  // Używana do uruchomienia scen gry Phaser.
  onStart(fn) {
    this.menuBtns[0].addEventListener("click", fn);
  }

  // Obsługa kliknięcia przycisku "Poziomy".
  handleLevelsClick() {
    this.hide(0.6); // Ukrywa główne menu.
    this.levelsViewComponent.show(); // Pokazuje widok wyboru poziomów.
  }

  // Obsługa kliknięcia przycisku "Ustawienia".
  handleSettingsClick() {
    this.hide(0.6); // Ukrywa główne menu.
    this.settingsViewComponent.show(); // Pokazuje widok ustawień.
  }
}

export default MainMenuController;
