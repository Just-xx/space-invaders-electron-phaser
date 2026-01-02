import LevelsViewComponent from "../components/LevelsViewComponent";

class MainMenuController {
  constructor(game) {
    this.levelsViewComponent = new LevelsViewComponent(this, game);

    this.menuBtns = document.querySelectorAll(".menu-btn");

    this.heroImgWrapper = document.querySelector(".hero-menu-img-wrapper");
    this.titleWrapper = document.querySelector(".title-wrapper");
    this.menuBtnsWrapper = document.querySelector(".menu-btns-wrapper");
    this.game = document.querySelector("#game");

    this.startBtn = document.querySelector('#menu-start-btn');
    this.updateLevel();

    
    this.levelsBtn = document.querySelector('#menu-levels-btn');

    this.startBtn.addEventListener("click", () => this.hide());
    this.levelsBtn.addEventListener('click', () => this.handleLevelsClick());
  }

  updateLevel() {
    this.startBtn.innerHTML = `Start <span class="level-text">(Pozom: ${window.localStorage.getItem('current-level') || 1})<span>`
  }

  hide(opacity = 0.98) {
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

    setTimeout(() => {
      this.game.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    }, 450);

    this.menuBtns.forEach(btn => btn.style.pointerEvents = "none");
  }

  show() {
    this.updateLevel();
    this.menuBtns.forEach(btn => btn.style.pointerEvents = "auto");

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
  }

  onStart(fn) {
    this.menuBtns[0].addEventListener("click", fn);
  }

  handleLevelsClick() {
    this.hide(0.6);
    this.levelsViewComponent.show();
  }

  options() {}
}

export default MainMenuController;
