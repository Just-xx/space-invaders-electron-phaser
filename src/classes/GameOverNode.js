class GameOverNode {
  constructor() {
    this.mounted = false;

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("game-over-node-wrapper");

    // title nodes
    this.titleText = document.createElement("div");
    this.titleText.textContent = "Koniec gry";
    this.titleText.classList.add("game-over-node-title");
    this.wrapper.appendChild(this.titleText);

    // stats nodes
    this.scoreText = document.createElement("div");
    this.levelText = document.createElement("div");
    this.bestScoreText = document.createElement("div");

    this.infoWrapper = document.createElement("div");
    this.infoWrapper.classList.add("game-over-node-info-wrapper");

    this.infoWrapper.appendChild(this.scoreText);
    this.infoWrapper.appendChild(this.levelText);
    this.infoWrapper.appendChild(this.bestScoreText);

    this.setBestScore(0);
    this.setScore(0);
    this.setLevel(0);

    this.wrapper.appendChild(this.infoWrapper);

    // btns nodes
    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("game-over-node-btns-wrapper");

    this.resartBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.resartBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.resartBtn.textContent = "Spróbuj ponownie";
    this.returnBtn.textContent = "Powrót";

    this.btnsWrapper.appendChild(this.resartBtn);
    this.btnsWrapper.appendChild(this.returnBtn);

    this.wrapper.appendChild(this.btnsWrapper);
    this.wrapper.style.display = "none";

    this.mount();
  }

  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }

  show() {
    this.wrapper.style.display = "flex";
  }

  hide() {
    this.wrapper.style.display = "none";
  }

  setScore(score) {
    this.scoreText.textContent = "Wynik: " + score;
  }

  setBestScore(bestScore) {
    this.bestScoreText.textContent = "Najlpeszy Wynik: " + bestScore;
  }

  setLevel(level) {
    this.levelText.textContent = "Poziom: " + level;
  }

  onRestart(cb) {
    this.resartBtn.addEventListener("click", cb);
  }

  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default GameOverNode;
