// Import definicji schematów (układów) wrogów dla wszystkich poziomów.
import {ENEMIES_SCHEMES} from "../../constants/ENEMIES_SCHEMES";

// Definicja klasy LevelController.
// Jest to klasa pomocnicza, niezależna od Phrasera, odpowiedzialna za zarządzanie logiką poziomów,
// progresją gracza oraz zapisywaniem i odczytywaniem postępów z `localStorage`.
class LevelController {
  // Konstruktor klasy, inicjalizuje stan kontrolera.
  constructor() {
    this.SCHEMES = ENEMIES_SCHEMES; // Przypisanie schematów wrogów.

    // Odczytanie aktualnego poziomu z localStorage; jeśli nie istnieje, domyślnie ustawia na 1.
    this.currentLevel = window.localStorage.getItem("current-level");
    if (!this.currentLevel) this.currentLevel = 1;
    this.currentLevel = parseInt(this.currentLevel);

    // Odczytanie listy ukończonych poziomów z localStorage.
    this.passedLevels = window.localStorage.getItem("passed-levels");
    if (this.passedLevels) this.passedLevels = this.passedLevels.split(","); // Konwersja stringa na tablicę.
    else this.passedLevels = [];
  }

  // Przechodzi do następnego poziomu.
  nextLevel() {
    if (this.currentLevel < 15) {
      this.setCurrentAsPassed(); // Zapisuje bieżący poziom jako ukończony.
      this.currentLevel++; // Inkrementuje numer poziomu.
      window.localStorage.setItem("current-level", this.currentLevel); // Zapisuje nowy poziom w localStorage.
    }

    return this.getCurrentLevel(); // Zwraca konfigurację dla nowego poziomu.
  }

  // Zapisuje bieżący poziom jako ukończony.
  setCurrentAsPassed() {
    // Sprawdza, czy poziom nie został już wcześniej zapisany.
    if (this.passedLevels.indexOf(this.currentLevel) >= 0) return;
    this.passedLevels.push(this.currentLevel); // Dodaje poziom do listy ukończonych.
    window.localStorage.setItem("passed-levels", this.passedLevels); // Zapisuje zaktualizowaną listę.
  }

  // Ustawia numer bieżącego poziomu.
  setCurrentLevel(lvl) {
    this.currentLevel = lvl;
    window.localStorage.setItem("current-level", this.currentLevel); // Zapisuje zmianę w localStorage.
  }

  // Zwraca obiekt konfiguracyjny dla bieżącego poziomu.
  getCurrentLevel() {
    return {
      // Pobranie schematu wrogów dla danego poziomu.
      scheme: this.SCHEMES[this.currentLevel - 1],
      // Obliczenie prędkości wrogów na podstawie numeru poziomu.
      speed: this.currentLevel * 5 + 85,
      // Obliczenie szansy na strzał (im wyższy poziom, tym mniejsza wartość, a więc większa szansa).
      shootChance: 80 / (this.currentLevel / 10 + 0.5),
    };
  }
}

export default LevelController;
