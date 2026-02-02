// Reprezentuje komponent menu pauzy, wyświetlany po wstrzymaniu gry.
class EscapeMenuComponent {
  // Tworzy instancję komponentu menu pauzy.
  constructor() {
    // Wskazuje, czy komponent jest zamontowany w DOM.
    this.mounted = false;
    // Wskazuje, czy komponent jest aktualnie widoczny.
    this.visible = false;

    // Utworzenie głównych elementów DOM dla komponentu.
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");

    this.titleText = document.createElement("div");
    this.titleText.textContent = "Pauza";
    this.titleText.classList.add("node-title");
    this.wrapper.appendChild(this.titleText);

    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("node-btns-wrapper", "lc-node-btns-wrapper");

    this.continueBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.continueBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.continueBtn.innerHTML = `<i class="ri-play-line"></i> Kontynuuj`;
    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i> Powrót`;

    this.btnsWrapper.appendChild(this.returnBtn);
    this.btnsWrapper.appendChild(this.continueBtn);

    this.wrapper.appendChild(this.btnsWrapper);
    this.wrapper.style.display = "none";

    this.mount();
  }

  // Montuje komponent w DOM.
  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }

  // Pokazuje menu pauzy.
  show(gameScene) {
    this.wrapper.style.display = "flex";
    this.visible = true;

    this.continueBtn.addEventListener("click", () => {
      gameScene.scene.resume();
      this.hide();
    });
  }

  // Ukrywa menu pauzy.
  hide() {
    this.wrapper.style.display = "none";
    this.visible = false;
  }

  // Rejestruje funkcję zwrotną dla przycisku "Kontynuuj".
  onContinue(cb) {
    this.continueBtn.addEventListener("click", cb);
  }

  // Rejestruje funkcję zwrotną dla przycisku "Powrót".
  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default EscapeMenuComponent;