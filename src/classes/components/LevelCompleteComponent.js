// Reprezentuje komponent ekranu ukończenia poziomu.
class LevelCompleteComponent {
  // Tworzy instancję komponentu ukończenia poziomu.
  constructor() {
    // Wskazuje, czy komponent jest zamontowany w DOM.
    this.mounted = false;

    // Utworzenie głównych elementów DOM dla komponentu.
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");

    this.titleText = document.createElement("div");
    this.titleText.textContent = "Poziom ukończony!";
    this.titleText.classList.add("node-title");
    this.wrapper.appendChild(this.titleText);

    this.scoreText = document.createElement("div");
    this.levelText = document.createElement("div");

    this.infoWrapper = document.createElement("div");
    this.infoWrapper.classList.add("node-info-wrapper");

    this.infoWrapper.appendChild(this.scoreText);
    this.infoWrapper.appendChild(this.levelText);

    this.setScore(0);
    this.setLevel(0);

    this.wrapper.appendChild(this.infoWrapper);

    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("node-btns-wrapper");

    this.nextLvlBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.nextLvlBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.nextLvlBtn.innerHTML = `Następny poziom <i class="ri-arrow-right-fill"></i>`;
    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i> Powrót`;

    this.btnsWrapper.appendChild(this.returnBtn);
    this.btnsWrapper.appendChild(this.nextLvlBtn);

    this.wrapper.appendChild(this.btnsWrapper);
    this.wrapper.style.display = "none";

    this.mount();
    this.hide();
  }

  // Montuje komponent w DOM.
  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }

  // Pokazuje ekran ukończenia poziomu.
  show() {
    this.wrapper.style.display = "flex";
    this.wrapper.style.opacity = "1";
  }

  // Ukrywa ekran ukończenia poziomu.
  hide() {
    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";
    }, 200);
  }

  // Ustawia wyświetlany wynik.
  setScore(score) {
    this.scoreText.innerHTML = `Uzyskany wynik: <b>${score}</b>`;
  }

  // Ustawia wyświetlany numer ukończonego poziomu.
  setLevel(level) {
    this.levelText.innerHTML = `Ukończony poziom: <b>${level}</b>`;
  }

  // Rejestruje funkcję zwrotną dla przycisku "Następny poziom".
  onNextLevelClick(cb) {
    this.nextLvlBtn.addEventListener("click", cb);
  }

  // Rejestruje funkcję zwrotną dla przycisku "Powrót".
  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default LevelCompleteComponent;