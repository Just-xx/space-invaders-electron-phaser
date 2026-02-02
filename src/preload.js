// Plik preload.js działa jako bezpieczny most między procesem renderera (interfejsem użytkownika) a procesem głównym (Node.js).
// Używa modułu `contextBridge` do udostępniania określonych funkcji procesowi renderera.

// Imporotwanie zależności używane w pliku.
import { contextBridge, ipcRenderer } from "electron";

// W tym przypadku`contextBridge` udostępnia funkcję `toggleFullScreen` poprzez globalny obiekt `window.electronAPI`,
// co pozwala na bezpieczną komunikację i przełączanie trybu pełnoekranowego z poziomu interfejsu.
contextBridge.exposeInMainWorld("electronAPI", {
  toggleFullScreen: active => ipcRenderer.send("toggle-fullscreen", active),
});