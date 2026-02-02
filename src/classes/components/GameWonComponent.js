/**
 * Reprezentuje komponent ekranu wygranej gry.
 * Wyświetlany, gdy gracz ukończy wszystkie poziomy.
 */
class GameWonComponent {
  /**
   * Tworzy instancję komponentu wygranej gry.
   */
  constructor() {
    /**
     * @property {boolean} mounted - Wskazuje, czy komponent jest zamontowany w DOM.
     */
    this.mounted = false;

    // Utworzenie głównych elementów DOM dla komponentu
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("node-wrapper");
    this.wrapper.classList.add("game-won-node-wrapper");

    this.titleText = document.createElement("div");
    this.titleText.textContent = "Gratulacje!";
    this.titleText.classList.add("node-title");
    this.wrapper.appendChild(this.titleText);

    this.subtitleText = document.createElement("div");
    this.subtitleText.textContent = "Ostatni poziom został ukończony";
    this.subtitleText.classList.add("node-subtitle");
    this.wrapper.appendChild(this.subtitleText);

    this.btnsWrapper = document.createElement("div");
    this.btnsWrapper.classList.add("node-btns-wrapper");
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn");
    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i> Powrót do menu`;

    this.btnsWrapper.appendChild(this.returnBtn);

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
   * Pokazuje ekran wygranej gry.
   */
  show() {
    this.wrapper.style.display = "flex";
    this.wrapper.style.opacity = "1";
  }

  /**
   * Ukrywa ekran wygranej gry.
   */
  hide() {
    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";
    }, 200);
  }

  /**
   * Rejestruje funkcję zwrotną dla kliknięcia przycisku "Powrót do menu".
   * @param {Function} cb - Funkcja zwrotna.
   */
  onReturn(cb) {
    this.returnBtn.addEventListener("click", cb);
  }
}

export default GameWonComponent;