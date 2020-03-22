import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import icon from '../assets/tomato.png';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let tray = null;
let mainWindow: BrowserWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function onReady() {
  createWindow();
  setUpTray();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 350,
    width: 500,
    icon: path.join(__dirname, icon),
    resizable: false,
    kiosk: true,
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

function setUpTray() {
  tray = new Tray(path.join(__dirname, icon));
  const contextMenu = Menu.buildFromTemplate([]);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (hasNoWindows()) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
}

app.on('ready', onReady);

app.on('window-all-closed', () => {});

app.on('activate', () => {
  if (hasNoWindows()) {
    createWindow();
  }
});

function hasNoWindows() {
  return BrowserWindow.getAllWindows().length === 0;
}
