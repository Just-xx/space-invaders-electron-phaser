class LevelCompleteNode {
  constructor() {
    this.mounted = false;

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("lc-node-wrapper");

    // title nodes
    this.titleText = document.createElement("div");
    this.titleText.textContent = "Poziom ukończony!";
    this.titleText.classList.add("lc-node-title");
    this.wrapper.appendChild(this.titleText);

    // stats nodes
    this.scoreText = document.createElement("div");
    this.levelText = document.createElement("div");

    this.infoWrapper = document.createElement("div");
    this.infoWrapper.classList.add("lc-node-info-wrapper");

    this.infoWrapper.appendChild(this.scoreText);
    this.infoWrapper.appendChild(this.levelText);

    this.setScore(0);
    this.setLevel(0);

    this.wrapper.appendChild(this.infoWrapper);

    // btns nodes
    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("lc-node-btns-wrapper");

    this.nextLvlBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.nextLvlBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.nextLvlBtn.textContent = "Następny poziom";
    this.returnBtn.textContent = "Powrót";

    this.btnsWrapper.appendChild(this.nextLvlBtn);
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

  setLevel(level) {
    this.levelText.textContent = "Poziom: " + level;
  }

  onNextLevelClick(cb) {
    this.nextLvlBtn.addEventListener("click", cb);
  }

  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default LevelCompleteNode;
