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

    this.addVolumeSection("Głośność efektów: ", "volume-effects");
    this.addVolumeSection("Głośność muzyki: ", "volume-music");

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

    // mount and hide
    this.mount();
    this.hide();
  }

  addVolumeSection(text, id) {
    const settingWrapper = document.createElement("div");
    settingWrapper.classList.add("setting-volume");

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

  handleVolumeChange(e, displayText) {
    const val = e.target.value;
    const id = e.target.id;

    displayText.textContent = val + "%";
    window.localStorage.setItem(id, val / 100);

    this.mainMenuController.music.volume = this.getVolume().music;
  }

  getVolume() {
    let volumeEffects = window.localStorage.getItem("volume-effects");
    let volumeMusic = window.localStorage.getItem("volume-music");

    if (volumeEffects) volumeEffects = parseFloat(volumeEffects);
    else volumeEffects = 0.05;

    if (volumeMusic) volumeMusic = parseFloat(volumeMusic);
    else volumeMusic = 0.02;

    const volume = {
      effects: volumeEffects,
      music: volumeMusic,
    };

    return volume;
  }

  hide() {
    window.removeEventListener("keydown", this.boundHandleEscapeKey);

    this.wrapper.style.opacity = "0";
    setTimeout(() => {
      this.wrapper.style.display = "none";

      const settingWrappersRows = this.settingsWrapper.children;
      for (let i = 0; i < settingWrappersRows.length; i++) {
        const row = settingWrappersRows[i];
        row.style.opacity = '';
        row.style.transform = '';
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
