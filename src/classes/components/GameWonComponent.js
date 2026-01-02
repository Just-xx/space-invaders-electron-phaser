class GameWonComponent {
  constructor() {
    this.mounted = false;

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");

    // title nodes
    this.titleText = document.createElement("div");
    this.titleText.textContent = "Gratulacje! Ostatni poziom został ukończony";
    this.titleText.classList.add("node-title");
    this.wrapper.appendChild(this.titleText);

    // btns nodes
    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("node-btns-wrapper");
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn");
    this.returnBtn.textContent = "Powrót do menu";

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

  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default GameWonComponent;
