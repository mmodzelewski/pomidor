import { Observable, Subject } from 'rxjs';

export class Timer {

  private remainingTime = 25 * 60;
  private intervalId: NodeJS.Timeout = null;
  private timeChange: Subject<number> = new Subject<number>();

  start(): Observable<number> {
    if (!!this.intervalId) {
      return this.timeChange;
    }
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.timeChange.next(this.remainingTime);
      if (this.remainingTime === 0) {
        this.stop();
      }
    }, 1000);
    return this.timeChange;
  }

  stop(): void {
    if (!!this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
