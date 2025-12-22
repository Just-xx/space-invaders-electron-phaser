class MainMenu {
  constructor() {
    this.visible = true;
    this.menuBtns = document.querySelectorAll(".menu-btn");

    this.menuBtns.forEach(btn => {
      btn.addEventListener("click", this.hide);
    });
  }

  hide() {
    const heroImgWrapper = document.querySelector(".hero-menu-img-wrapper");
    const titleWrapper = document.querySelector(".title-wrapper");
    const menuBtns = document.querySelector(".menu-btns-wrapper");
    const game = document.querySelector("#game");

    heroImgWrapper.style.transform = "translateX(100%) rotate(25deg)";
    heroImgWrapper.style.opacity = "0";

    setTimeout(() => {
      titleWrapper.style.transform = "translateY(-100%)";
      titleWrapper.style.opacity = "0";
    }, 150);

    setTimeout(() => {
      menuBtns.style.transform = "translateY(100%)";
      menuBtns.style.opacity = "0";
    }, 300);

    setTimeout(() => {
      game.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    }, 450);

    this.visible = false;
  }

  onStart(fn) {
    this.menuBtns[0].addEventListener("click", fn);
  }

  options() {}
}

export default MainMenu;