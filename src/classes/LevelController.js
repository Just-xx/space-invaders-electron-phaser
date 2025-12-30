import {ENEMIES_SCHEMES} from "../constants/ENEMIES_SCHEMES";

class LevelController {
  constructor() {
    this.currentLevel = 1;
    this.SCHEMES = ENEMIES_SCHEMES;
  }

  nextLevel() {
    this.currentLevel++;
    return this.getCurrentLevel();
  }

  getCurrentLevel() {
    return {
      scheme: this.SCHEMES[this.currentLevel],
      speed: this.currentLevel * 5 + 85,
      shootChance: 150 / (this.currentLevel / 10 + 0.5)
    };
  }
}

export default LevelController;
