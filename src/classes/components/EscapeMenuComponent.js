class EscapeMenuComponent {
  constructor() {
    this.mounted = false;
    this.visible = false;

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");

    // title nodes
    this.titleText = document.createElement("div");
    this.titleText.textContent = "Pauza";
    this.titleText.classList.add("node-title");
    this.wrapper.appendChild(this.titleText);

    // btns nodes
    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("node-btns-wrapper");
    this.btnsWrapper.classList.add("lc-node-btns-wrapper");

    this.continueBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.continueBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.continueBtn.textContent = "Kontynuuj";
    this.returnBtn.textContent = "Powrót";

    this.btnsWrapper.appendChild(this.continueBtn);
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

  show(gameScene) {
    this.wrapper.style.display = "flex";
    this.visible = true;

    this.continueBtn.addEventListener("click", () => {
      gameScene.scene.resume();
      this.hide();
    });
  }

  hide() {
    this.wrapper.style.display = "none";
    this.visible = false;
  }

  onContinue(cb) {
    this.continueBtn.addEventListener("click", cb);
  }

  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default EscapeMenuComponent;
