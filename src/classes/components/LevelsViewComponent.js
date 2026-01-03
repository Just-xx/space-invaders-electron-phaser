const lvlImgsGlob = import.meta.glob("../../assets/levels/*.{png,jpg,jpeg,svg}", {eager: true});

const lvlImgs = Object.fromEntries(
  Object.entries(lvlImgsGlob).map(([path, module]) => {
    return [
      path.split("/").pop().split(".")[0], // wyciąga "photo" z "./assets/photo.png"
      module.default,
    ];
  })
);

class LevelsViewComponent {
  constructor(mainMenuController, game) {
    this.game = game;
    this.mounted = false;
    this.mainMenuController = mainMenuController;
    this.boundHandleEscapeKey = this.handleEscapeKey.bind(this);

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("level-view-wrapper");

    // title
    this.title = document.createElement("h2");
    this.title.textContent = "Wybierz poziom (1-15)";

    this.wrapper.appendChild(this.title);

    // levels wrapper
    this.levelsWrapper = document.createElement("div");
    this.levelsWrapper.classList.add("level-view-levels-wrapper");

    this.wrapper.appendChild(this.levelsWrapper);
    this.generateLevelBtns();

    // return btn
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn");
    this.returnBtn.classList.add("level-view-return-btn");

    this.returnBtn.textContent = "Powrót";

    this.returnBtn.addEventListener("click", () => {
      this.hide();
      this.mainMenuController.show();
    });

    this.wrapper.appendChild(this.returnBtn);

    this.mount();
    this.hide();
  }

  generateLevelBtns() {
    let passedLevels = window.localStorage.getItem("passed-levels");
    if (passedLevels) passedLevels = passedLevels.split(",");
    else passedLevels = [];

    passedLevels = passedLevels.map(item => parseInt(item));

    for (let i = 0; i < 15; i++) {

      const lvlButton = document.createElement("button");
      lvlButton.dataset.level = i + 1;
      lvlButton.classList.add("btn");

      if (passedLevels.indexOf(i + 1) > -1)
        lvlButton.innerHTML = `<span class="lvl-done">${i + 1}<span>ukończony<span><span>`;
      else lvlButton.innerHTML = `<span>${i + 1}<span>`;

      const image = document.createElement("img");
      image.src = lvlImgs[i + 1];
      image.alt = i + 1;

      lvlButton.appendChild(image);

      this.levelsWrapper.appendChild(lvlButton);

      setTimeout(() => {
        lvlButton.style.opacity = '1';
        lvlButton.style.transform = 'translateY(0px)';
      }, 30 * i)
      
      lvlButton.addEventListener("click", e => this.handleLevelBtnClick(e));
    }
  }

  handleLevelBtnClick(e) {
    const level = parseInt(e.target.dataset.level);

    this.game.scene.start("scene-game", {level: level});
    this.game.scene.start("scene-ui", this.mainMenuController);
    this.game.showGameCanvas();

    this.hide();
    this.mainMenuController.hide();
  }

  hide() {
    window.removeEventListener("keydown", this.boundHandleEscapeKey);

    this.wrapper.style.opacity = "0";

    setTimeout(() => {
      this.wrapper.style.display = "none";
    }, 200);
  }

  handleEscapeKey(e) {
    if (e.key === "Escape") {
      this.hide();
      this.mainMenuController.show();
    }
  }

  show() {
    this.wrapper.style.display = "block";
    this.wrapper.style.opacity = "0";
    window.addEventListener("keydown", this.boundHandleEscapeKey);

    this.levelsWrapper.replaceChildren();
    

    setTimeout(() => {
      this.wrapper.style.opacity = "1";
      this.generateLevelBtns();
    }, 200);
  }

  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }
}

export default LevelsViewComponent;
