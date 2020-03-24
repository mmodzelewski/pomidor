import { ipcRenderer } from 'electron';
import { TimerAction } from './timer';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    timer: {
      start: () => void;
      stop: () => void;
      updates: Observable<number>;
    };
  }
}

window.timer = {
  start: () => {
    ipcRenderer.send('timer-actions', TimerAction.START);
  },
  stop: () => {
    ipcRenderer.send('timer-actions', TimerAction.STOP);
  },
  updates: new Observable((subscriber) => {
    ipcRenderer.on('time-update', (event, args) => {
      subscriber.next(+args);
    });
  }),
};
