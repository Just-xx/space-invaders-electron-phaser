

class SettingsViewComponent {
  constructor(mainMenuController, game) {

    this.game = game;
    this.mounted = false;
    this.mainMenuController = mainMenuController;
    this.boundHandleEscapeKey = this.handleEscapeKey.bind(this);

    // wrapper
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("settings-view-wrapper");

    // title
    this.title = document.createElement("h2");
    this.title.textContent = "Ustawienia";

    this.wrapper.appendChild(this.title);

    // settings wrapper
    this.settingsWrapper = document.createElement("div");
    this.settingsWrapper.classList.add("settings-view-settings-wrapper");

    // TODO: fix this
    this.settingsWrapper.innerHTML = `
      <div class="setting-volume">
        <label for="volume">Głośność efektów:</label>
        <input type="range" id="volume" name="volume" min="0" max="100" value="50" step="1">
        <span id="value-display">50</span>
      </div>
      <div class="setting-volume">
        <label for="volume">Głośność muzyki:</label>
        <input type="range" id="volume" name="volume" min="0" max="100" value="50" step="1">
        <span id="value-display">50</span>
      </div>
    `

    this.wrapper.appendChild(this.settingsWrapper);

    // return btn
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn");
    this.returnBtn.classList.add("settings-view-return-btn");

    this.returnBtn.textContent = "Powrót";

    this.returnBtn.addEventListener("click", () => {
      this.hide();
      this.mainMenuController.show();
    });

    this.wrapper.appendChild(this.returnBtn);

    this.mount();
    this.hide();
  }

  hide() {
    window.removeEventListener("keydown", this.boundHandleEscapeKey);

    this.wrapper.style.opacity = "0";

    setTimeout(() => {
      this.wrapper.style.display = "none";
    }, 200);
  }

  handleEscapeKey(e) {
    if (e.key === "Escape") {
      this.hide();
      this.mainMenuController.show();
    }
  }

  show() {
    this.wrapper.style.display = "block";
    this.wrapper.style.opacity = "0";
    window.addEventListener("keydown", this.boundHandleEscapeKey);

    setTimeout(() => {
      this.wrapper.style.opacity = "1";
    }, 200);
  }

  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }
}

export default SettingsViewComponent;
