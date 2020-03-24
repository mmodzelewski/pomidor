import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';
import icon from '../assets/tomato.png';
import { Timer, TimerAction } from './timer';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

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
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.on('close', () => {
    mainWindow = null;
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

let timer = new Timer();
timer.updates.subscribe(remainingTime => {
  mainWindow?.webContents.send('time-update', remainingTime);
});

ipcMain.on('timer-actions', (event, args) => {
  switch (args) {
    case TimerAction.START:
      timer.start();
      break;
    case TimerAction.STOP:
      timer.stop();
      break;
    default:
      throw 'unhandled action';
  }
});
