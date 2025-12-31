class MainMenu {
  constructor() {
    this.menuBtns = document.querySelectorAll(".menu-btn");

    this.heroImgWrapper = document.querySelector(".hero-menu-img-wrapper");
    this.titleWrapper = document.querySelector(".title-wrapper");
    this.menuBtnsWrapper = document.querySelector(".menu-btns-wrapper");
    this.game = document.querySelector("#game");

    this.menuBtns.forEach(btn => {
      btn.addEventListener("click", () => this.hide());
    });
  }

  hide() {
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
      this.game.style.backgroundColor = "rgba(0, 0, 0, 0.98)";
    }, 450);
  }

  show() {
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

  options() {}
}

export default MainMenu;
