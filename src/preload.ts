import { ipcRenderer } from 'electron';
import { TimerAction, TimerState } from './timer';
import { Observable } from 'rxjs';
import { PomodoroStage } from './pomodoro-timer';
import { Channel } from './channel';

declare global {
  interface Window {
    timer: {
      start: () => void;
      pause: () => void;
      timeUpdates: Observable<number>;
      stateUpdates: Observable<TimerState>;
      stageUpdates: Observable<PomodoroStage>;
    };
  }
}

window.timer = {
  start: (): void => {
    ipcRenderer.send(Channel.TimerActions, TimerAction.START);
  },
  pause: (): void => {
    ipcRenderer.send(Channel.TimerActions, TimerAction.PAUSE);
  },
  timeUpdates: new Observable((subscriber) => {
    ipcRenderer.on(Channel.TimeUpdate, (event, args) => {
      subscriber.next(+args);
    });
  }),
  stateUpdates: new Observable((subscriber) => {
    ipcRenderer.on(Channel.StateUpdate, (event, args) => {
      subscriber.next(args);
    });
  }),
  stageUpdates: new Observable((subscriber) => {
    ipcRenderer.on(Channel.StageUpdate, (event, args) => {
      subscriber.next(args);
    });
  }),
};
