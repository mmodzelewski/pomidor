import { BehaviorSubject, Observable } from 'rxjs';

export class Timer {
  private readonly startValue = 25 * 60;
  private intervalId: NodeJS.Timeout = null;
  private timeChange: BehaviorSubject<number> = new BehaviorSubject<number>(this.startValue);

  get updates(): Observable<number> {
    return this.timeChange;
  }

  get currentTime(): number {
    return this.timeChange.value;
  }

  start(): void {
    if (this.intervalId) {
      return;
    }
    if (this.timeChange.value === 0) {
      this.timeChange.next(this.startValue);
    }
    this.intervalId = setInterval(() => {
      this.timeChange.next(this.timeChange.value - 1);
      if (this.timeChange.value === 0) {
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export enum TimerAction {
  START = 'START',
  STOP = 'STOP',
}
