document.querySelector("#menu-start-btn").addEventListener("click", hideMenu);

function hideMenu() {
  const heroImg = document.querySelector("#hero-menu-img");
  const titleWrapper = document.querySelector(".title-wrapper");
  const menuBtns = document.querySelector(".menu-btns-wrapper");
  const game = document.querySelector("#game");

  heroImg.style.transform = "translateX(100%)";
  heroImg.style.opacity = "0";

  setTimeout(() => {
    titleWrapper.style.transform = "translateY(-100%)";
    titleWrapper.style.opacity = "0";
  }, 150);

  setTimeout(() => {
    menuBtns.style.transform = "translateY(100%)";
    menuBtns.style.opacity = "0";
  }, 300);

  setTimeout(() => {
    game.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  }, 450);
}
