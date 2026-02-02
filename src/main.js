// Plik odpowiedzialny za zarządzanie oknem przeglądarki.
// Należy pamiętać, że electron.js "opakowuje" kod źródłowy (html, css, js) w okno przglądarki (chromium).

// Imporotwanie zależności używane w pliku.
import {app, BrowserWindow, nativeImage} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import iconUrl from "./assets/icons/icon.png";
import {ipcMain} from "electron";

// Jeżeli aplikacja jest już uruchomiona wówczas następuje zamknięcie
// (by nie otwierać wielu okien naraz).
if (started) app.quit();

// Funkcja odpowiedzialna za tworzenie okna przeglądarki za pośrednictwem API electron'a.
const createWindow = () => {
  // Tworzenie instancji przeglądarki.
  // z określoną konfiguracją zawierającą: wymiary początkowe,
  // minimialne wymiary,ikone, możliwość skalownia (true), itp...
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 720,
    minHeight: 580,
    icon: nativeImage.createFromDataURL(iconUrl),
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false,
    },
  });

  // W trybie deweloperskim aplikacja jest ładowana z serwera deweloperskiego Vite.
  // W trybie produkcyjnym, ładowany jest zbudowany plik HTML, a domyślne menu jest usuwane.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    mainWindow.removeMenu();
  }
};

// Po zainicjowaniu aplikacji, tworzone jest jej okno.
app.whenReady().then(() => {
  createWindow();

  // Ten event jest specyficzny dla systemu macOS. Jeśli żadne okno nie jest otwarte
  // po kliknięciu w ikonę w docku, tworzone jest nowe okno.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Nasłuchiwanie czy wszyskie okna aplikacja są zamknięte.
// Jeżeli tak, aplikacja jest zamykana. Natomiast, jeśli platforma to macOs,
// wtedy nie następuje zamknięcie apliakcji (imituje to zachowanie wszystkich aplikacji na mac'u)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Nasłuchuje na zdarzenie "toggle-fullscreen" wysłane z procesu renderera (odpowiedzialnego za wyświetlanie interfejsu).
// Po otrzymaniu zdarzenia, przełącza tryb pełnoekranowy dla okna przeglądarki.
ipcMain.on("toggle-fullscreen", (event, active) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setFullScreen(active);
});

// Ustawia identyfikator AppUserModelID, który jest wykorzystywany przez system Windows
// do grupowania okien aplikacji na pasku zadań i zarządzania powiadomieniami.
app.setAppUserModelId("com.squirrel.SpaceInvaders.SpaceInvaders");
