// Reprezentuje komponent widoku ustawień.
class SettingsViewComponent {
  // Tworzy instancję komponentu widoku ustawień.
  constructor(mainMenuController, game) {
    this.game = game;
    this.mounted = false;
    this.mainMenuController = mainMenuController;
    this.boundHandleEscapeKey = this.handleEscapeKey.bind(this);

    // Utworzenie głównych elementów DOM.
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("settings-view-wrapper");

    this.title = document.createElement("h2");
    this.title.textContent = "Dostosuj ustawienia";
    this.wrapper.appendChild(this.title);

    this.settingsWrapper = document.createElement("div");
    this.settingsWrapper.classList.add("settings-view-settings-wrapper");
    this.wrapper.appendChild(this.settingsWrapper);

    // Dodanie kontrolek ustawień.
    this.addVolumeControl("Głośność efektów: ", "volume-effects");
    this.addVolumeControl("Głośność muzyki: ", "volume-music");
    this.addFullscreenToggle("Tryb pełnoekranowy: ", "fullscreen");

    // Przycisk powrotu.
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn", "settings-view-return-btn");
    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i>Powrót`;
    this.returnBtn.addEventListener("click", () => {
      this.hide();
      this.mainMenuController.show();
    });
    this.wrapper.appendChild(this.returnBtn);

    this.mount();
    this.hide();

    // Zastosowanie trybu pełnoekranowego przy starcie.
    this.applyFullscreenMode(this.getFullscreenMode());
  }

  // Dodaje kontrolkę głośności (suwak).
  addVolumeControl(text, id) {
    const settingWrapper = document.createElement("div");
    settingWrapper.classList.add("setting-volume", "setting");

    const settingLabel = document.createElement("label");
    settingLabel.textContent = text;
    settingLabel.htmlFor = id;
    settingWrapper.appendChild(settingLabel);

    const settingInput = document.createElement("input");
    settingInput.type = "range";
    settingInput.id = id;
    settingInput.name = id;
    settingInput.min = 0;
    settingInput.max = 100;
    settingInput.value = id === "volume-effects" ? this.getVolume().effects * 100 : this.getVolume().music * 100;
    settingInput.step = 1;
    settingWrapper.appendChild(settingInput);

    const displayText = document.createElement("span");
    displayText.classList.add("setting-value-display");
    displayText.textContent = settingInput.value + "%";
    settingWrapper.appendChild(displayText);

    settingInput.addEventListener("input", e => this.handleVolumeChange(e, displayText));
    this.settingsWrapper.appendChild(settingWrapper);
  }

  // Pobiera ustawienia głośności z localStorage lub zwraca wartości domyślne.
  getVolume() {
    let volumeEffects = window.localStorage.getItem("volume-effects");
    let volumeMusic = window.localStorage.getItem("volume-music");

    volumeEffects = volumeEffects ? parseFloat(volumeEffects) : 0.3;
    volumeMusic = volumeMusic ? parseFloat(volumeMusic) : 0.15;

    return { effects: volumeEffects, music: volumeMusic };
  }

  // Dodaje przełącznik trybu pełnoekranowego.
  addFullscreenToggle(text, id) {
    const settingWrapper = document.createElement("div");
    settingWrapper.classList.add("setting-fullscreen", "setting");

    const settingLabel = document.createElement("label");
    settingLabel.textContent = text;
    settingLabel.htmlFor = id;
    settingWrapper.appendChild(settingLabel);

    const isActive = this.getFullscreenMode();

    const settingInput = document.createElement("input");
    settingInput.type = "checkbox";
    settingInput.id = id;
    settingInput.name = id;
    settingInput.checked = !!isActive;
    settingWrapper.appendChild(settingInput);

    const displayText = document.createElement("span");
    displayText.classList.add("setting-value-display");
    displayText.textContent = isActive ? "Wł." : "Wył.";
    settingWrapper.appendChild(displayText);

    this.settingsWrapper.appendChild(settingWrapper);

    settingInput.addEventListener("input", e => this.handleFullscreenModeChange(e, displayText));
    displayText.addEventListener("click", () => {
      settingInput.checked = !settingInput.checked;
      this.handleFullscreenModeChange({target: settingInput}, displayText);
    });

    document.addEventListener("fullscreenchange", () => {
      const isFullScreen = !!document.fullscreenElement;
      settingInput.checked = isFullScreen;
      displayText.textContent = isFullScreen ? "Wł." : "Wył.";
    });
  }

  // Obsługuje zmianę wartości głośności i zapisuje ją w localStorage.
  handleVolumeChange(e, displayText) {
    const val = e.target.value;
    const id = e.target.id;

    displayText.textContent = val + "%";
    window.localStorage.setItem(id, val / 100);

    this.mainMenuController.music.volume = this.getVolume().music;
  }

  // Obsługuje zmianę trybu pełnoekranowego i zapisuje stan w localStorage.
  handleFullscreenModeChange(e, displayText) {
    const checked = e.target.checked ? 1 : 0;
    const id = e.target.id;

    displayText.textContent = checked ? "Wł." : "Wył.";
    window.localStorage.setItem(id, checked);
    this.applyFullscreenMode(!!checked);
  }

  // Włącza lub wyłącza tryb pełnoekranowy.
  applyFullscreenMode(checked) {
    window.electronAPI.toggleFullScreen(checked);
  }

  // Pobiera stan trybu pełnoekranowego z localStorage.
  getFullscreenMode() {
    const fsActive = window.localStorage.getItem("fullscreen");
    return fsActive ? parseInt(fsActive) : 0;
  }

  // Ukrywa komponent widoku ustawień.
  hide() {
    window.removeEventListener("keydown", this.boundHandleEscapeKey);
    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";
      const settingWrappersRows = this.settingsWrapper.children;
      for (const row of settingWrappersRows) {
        row.style.opacity = "";
        row.style.transform = "";
      }
    }, 200);
  }

  // Pokazuje komponent widoku ustawień.
  show() {
    window.addEventListener("keydown", this.boundHandleEscapeKey);
    this.wrapper.style.display = "block";
    this.wrapper.style.opacity = "0";
    setTimeout(() => (this.wrapper.style.opacity = "1"), 200);

    const settingWrappersRows = this.settingsWrapper.children;
    for (let i = 0; i < settingWrappersRows.length; i++) {
      setTimeout(() => {
        settingWrappersRows[i].style.opacity = 1;
        settingWrappersRows[i].style.transform = "translateY(0px)";
      }, (i + 1) * 100);
    }
  }

  // Obsługuje naciśnięcie klawisza Escape.
  handleEscapeKey(e) {
    if (e.key === "Escape") {
      this.hide();
      this.mainMenuController.show();
    }
  }

  // Montuje komponent w DOM.
  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }
}

export default SettingsViewComponent;