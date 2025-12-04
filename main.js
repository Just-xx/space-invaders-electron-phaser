const { app, BrowserWindow } = require('electron');
const isDev = !app.isPackaged;

const createWindow = () => {
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    resizable: true
  });

  win.maximize();

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile('src/index.html');
  }

};

app.whenReady().then(() => {
  createWindow();
});
