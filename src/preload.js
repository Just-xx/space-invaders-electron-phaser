import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  toggleFullScreen: active => ipcRenderer.send("toggle-fullscreen", active),
});
