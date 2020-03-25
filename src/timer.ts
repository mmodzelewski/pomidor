import { Observable, Subject } from 'rxjs';

export class Timer {
  private remainingTime = 25 * 60;
  private intervalId: NodeJS.Timeout = null;
  private timeChange: Subject<number> = new Subject<number>();

  get updates(): Observable<number> {
    return this.timeChange;
  }

  start(): void {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.timeChange.next(this.remainingTime);
      if (this.remainingTime === 0) {
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    if (!!this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export enum TimerAction {
  START = 'START',
  STOP = 'STOP',
}
