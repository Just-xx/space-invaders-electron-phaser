import {app, BrowserWindow, nativeImage} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import iconUrl from "./assets/icons/icon.png";
import { ipcMain } from "electron";

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 720,
    minHeight: 580,
    icon: nativeImage.createFromDataURL(iconUrl),
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    mainWindow.removeMenu();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("toggle-fullscreen", (event, active) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setFullScreen(active);
});

app.setAppUserModelId("com.squirrel.SpaceInvaders.SpaceInvaders");
