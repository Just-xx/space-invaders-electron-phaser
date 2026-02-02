/**
 * Reprezentuje komponent ekranu końca gry.
 * Wyświetlany, gdy gracz przegra.
 */
class GameOverComponent {
  /**
   * Tworzy instancję komponentu końca gry.
   */
  constructor() {
    /**
     * @property {boolean} mounted - Wskazuje, czy komponent jest zamontowany w DOM.
     */
    this.mounted = false;

    // Utworzenie głównych elementów DOM dla komponentu
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");

    this.titleText = document.createElement("div");
    this.titleText.textContent = "Koniec gry";
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

    this.resartBtn = document.createElement("button");
    this.returnBtn = document.createElement("button");

    this.resartBtn.classList.add("btn");
    this.returnBtn.classList.add("btn");

    this.resartBtn.innerHTML = `<i class="ri-restart-line"></i> Spróbuj ponownie`;
    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i> Powrót`;

    this.btnsWrapper.appendChild(this.returnBtn);
    this.btnsWrapper.appendChild(this.resartBtn);

    this.wrapper.appendChild(this.btnsWrapper);
    this.wrapper.style.display = "none";

    this.mount();
    this.hide();
  }

  /**
   * Montuje komponent w DOM, dołączając go do elementu gry.
   */
  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }

  /**
   * Pokazuje ekran końca gry.
   */
  show() {
    this.wrapper.style.display = "flex";
    this.wrapper.style.opacity = "1";
  }

  /**
   * Ukrywa ekran końca gry.
   */
  hide() {
    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";
    }, 200);
  }

  /**
   * Ustawia wyświetlany wynik.
   * @param {number} score - Wynik gracza.
   */
  setScore(score) {
    this.scoreText.innerHTML = `Uzyskany wynik: <b>${score}</b>`;
  }

  /**
   * Ustawia wyświetlany poziom.
   * @param {number} level - Ostatni poziom, na którym był gracz.
   */
  setLevel(level) {
    this.levelText.innerHTML = `Aktualny poziom: <b>${level}</b>`;
  }

  /**
   * Rejestruje funkcję zwrotną dla kliknięcia przycisku "Spróbuj ponownie".
   * @param {Function} cb - Funkcja zwrotna.
   */
  onRestart(cb) {
    this.resartBtn.addEventListener("click", cb);
  }

  /**
   * Rejestruje funkcję zwrotną dla kliknięcia przycisku "Powrót".
   * @param {Function} cb - Funkcja zwrotna.
   */
  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default GameOverComponent;