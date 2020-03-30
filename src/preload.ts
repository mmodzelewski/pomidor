import { ipcRenderer } from 'electron';
import { TimerAction, TimerState } from './timer';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    timer: {
      start: () => void;
      pause: () => void;
      timeUpdates: Observable<number>;
      stateUpdates: Observable<TimerState>;
    };
  }
}

window.timer = {
  start: (): void => {
    ipcRenderer.send('timer-actions', TimerAction.START);
  },
  pause: (): void => {
    ipcRenderer.send('timer-actions', TimerAction.PAUSE);
  },
  timeUpdates: new Observable((subscriber) => {
    ipcRenderer.on('time-update', (event, args) => {
      subscriber.next(+args);
    });
  }),
  stateUpdates: new Observable((subscriber) => {
    ipcRenderer.on('state-update', (event, args) => {
      subscriber.next(args);
    });
  }),
};
