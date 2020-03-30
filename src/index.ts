import { app, BrowserWindow, ipcMain, Menu, Notification, Tray } from 'electron';
import * as path from 'path';
import icon from '../assets/tomato.png';
import { Timer, TimerAction } from './timer';
import { noop } from './utility';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray = null;
let mainWindow: BrowserWindow = null;
const timer = new Timer(25);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow(): void {
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

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('time-update', timer.time);
    mainWindow.webContents.send('state-update', timer.state);
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

function hasNoWindows(): boolean {
  return BrowserWindow.getAllWindows().length === 0;
}

function createOrShowWindow(): void {
  if (hasNoWindows()) {
    createWindow();
  } else {
    mainWindow.show();
  }
}

function setUpTray(): void {
  tray = new Tray(path.join(__dirname, icon));
  const contextMenu = Menu.buildFromTemplate([]);
  tray.setContextMenu(contextMenu);
  tray.on('click', createOrShowWindow);
}

function onReady(): void {
  createWindow();
  setUpTray();
}

app.on('ready', onReady);

app.on('window-all-closed', noop);

app.on('activate', () => {
  if (hasNoWindows()) {
    createWindow();
  }
});

function sendTimesUpNotification(remainingTime: number): void {
  if (remainingTime === 0 && Notification.isSupported()) {
    const notification = new Notification({
      title: 'Pomodoro timer',
      body: "Time's up",
    });
    notification.on('click', createOrShowWindow);
    notification.show();
  }
}

timer.timeUpdates.subscribe((remainingTime) => {
  mainWindow?.webContents.send('time-update', remainingTime);
  sendTimesUpNotification(remainingTime);
});

timer.stateUpdates.subscribe((state) => {
  mainWindow?.webContents.send('state-update', state);
});

ipcMain.on('timer-actions', (event, args) => {
  switch (args) {
    case TimerAction.START:
      timer.start(25);
      break;
    case TimerAction.PAUSE:
      timer.pause();
      break;
    default:
      throw 'unhandled action';
  }
});
