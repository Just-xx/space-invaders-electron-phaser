import {ENEMIES_SCHEMES} from "../../constants/ENEMIES_SCHEMES";

class LevelController {
  constructor() {
    this.SCHEMES = ENEMIES_SCHEMES;
    this.currentLevel = window.localStorage.getItem("current-level");
    if (!this.currentLevel) this.currentLevel = 1;
    this.currentLevel = parseInt(this.currentLevel);

    this.passedLevels = window.localStorage.getItem("passed-levels");
    if (this.passedLevels) this.passedLevels = this.passedLevels.split(",");
    else this.passedLevels = [];
  }

  nextLevel() {
    if (this.currentLevel < 15) {
      this.setCurrentAsPassed();
      this.currentLevel++;
      window.localStorage.setItem("current-level", this.currentLevel);
    }
    return this.getCurrentLevel();
  }

  setCurrentAsPassed() {
    this.passedLevels.push(this.currentLevel);
    window.localStorage.setItem("passed-levels", this.passedLevels);
  }

  setCurrentLevel(lvl) {
    this.currentLevel = lvl;
    window.localStorage.setItem("current-level", this.currentLevel);
  }

  getCurrentLevel() {
    return {
      scheme: this.SCHEMES[this.currentLevel - 1],
      speed: this.currentLevel * 5 + 85,
      shootChance: 80 / (this.currentLevel / 10 + 0.5),
    };
  }
}

export default LevelController;
