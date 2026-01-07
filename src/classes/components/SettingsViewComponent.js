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
    this.title.textContent = "Dostosuj ustawienia";

    this.wrapper.appendChild(this.title);

    // settings wrapper
    this.settingsWrapper = document.createElement("div");
    this.settingsWrapper.classList.add("settings-view-settings-wrapper");

    this.wrapper.appendChild(this.settingsWrapper);

    // actual settings
    this.addVolumeControl("Głośność efektów: ", "volume-effects");
    this.addVolumeControl("Głośność muzyki: ", "volume-music");
    this.addFullscreenToggle("Tryb pełnoeranowy: ", "fullscreen");

    // return btn
    this.returnBtn = document.createElement("button");
    this.returnBtn.classList.add("btn");
    this.returnBtn.classList.add("settings-view-return-btn");

    this.returnBtn.innerHTML = `<i class="ri-arrow-left-fill"></i>Powrót`;

    this.returnBtn.addEventListener("click", () => {
      this.hide();
      this.mainMenuController.show();
    });

    this.wrapper.appendChild(this.returnBtn);

    // mount and hide
    this.mount();
    this.hide();

    // other
    this.applyFullscreenMode(this.getFullscreenMode());
  }

  addVolumeControl(text, id) {
    // "id" is used both for html element id and name of the option in local storage

    const settingWrapper = document.createElement("div");
    settingWrapper.classList.add("setting-volume");
    settingWrapper.classList.add("setting");

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

  getVolume() {
    let volumeEffects = window.localStorage.getItem("volume-effects");
    let volumeMusic = window.localStorage.getItem("volume-music");

    if (volumeEffects) volumeEffects = parseFloat(volumeEffects);
    else volumeEffects = 0.3;

    if (volumeMusic) volumeMusic = parseFloat(volumeMusic);
    else volumeMusic = 0.15;

    const volume = {
      effects: volumeEffects,
      music: volumeMusic,
    };

    return volume;
  }

  addFullscreenToggle(text, id) {
    const settingWrapper = document.createElement("div");
    settingWrapper.classList.add("setting-fullscreen");
    settingWrapper.classList.add("setting");

    const settingLabel = document.createElement("label");
    settingLabel.textContent = text;
    settingLabel.htmlFor = id;
    settingWrapper.appendChild(settingLabel);

    const isActive = this.getFullscreenMode();

    const settingInput = document.createElement("input");
    settingInput.type = "checkbox";
    settingInput.id = id;
    settingInput.name = id;
    settingInput.checked = isActive;
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
      const isActive = document.fullscreenElement ? true : false;
      settingInput.checked = isActive;
      displayText.textContent = isActive ? "Wł." : "Wył.";
    });
  }

  handleVolumeChange(e, displayText) {
    const val = e.target.value;
    const id = e.target.id;

    displayText.textContent = val + "%";
    window.localStorage.setItem(id, val / 100);

    this.mainMenuController.music.volume = this.getVolume().music;
  }

  handleFullscreenModeChange(e, displayText) {
    const checked = e.target.checked ? 1 : 0;
    const id = e.target.id;

    displayText.textContent = checked ? "Wł." : "Wył.";

    window.localStorage.setItem(id, checked);
    this.applyFullscreenMode(this.getFullscreenMode());
  }

  applyFullscreenMode(checked) {
    window.electronAPI.toggleFullScreen(checked);
  }

  getFullscreenMode() {
    let fsActive = window.localStorage.getItem("fullscreen");

    if (fsActive) fsActive = parseInt(fsActive);
    else fsActive = 0;

    return fsActive;
  }

  hide() {
    window.removeEventListener("keydown", this.boundHandleEscapeKey);

    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";

      const settingWrappersRows = this.settingsWrapper.children;
      for (let i = 0; i < settingWrappersRows.length; i++) {
        const row = settingWrappersRows[i];
        row.style.opacity = "";
        row.style.transform = "";
      }
    }, 200);
  }

  show() {
    window.addEventListener("keydown", this.boundHandleEscapeKey);

    this.wrapper.style.display = "block";
    this.wrapper.style.opacity = "0";
    setTimeout(() => (this.wrapper.style.opacity = "1"), 200);

    const settingWrappersRows = this.settingsWrapper.children;

    for (let i = 0; i < settingWrappersRows.length; i++) {
      setTimeout(
        () => {
          settingWrappersRows[i].style.opacity = 1;
          settingWrappersRows[i].style.transform = "translateY(0px)";
        },
        (i + 1) * 100
      );
    }
  }

  handleEscapeKey(e) {
    if (e.key === "Escape") {
      this.hide();
      this.mainMenuController.show();
    }
  }

  mount() {
    if (this.mounted) return;
    this.mounted = true;
    document.querySelector("#game").appendChild(this.wrapper);
  }
}

export default SettingsViewComponent;
