import { asapScheduler, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, observeOn } from 'rxjs/internal/operators';

export enum TimerAction {
  START,
  PAUSE,
}

export enum TimerState {
  RUNNING,
  PAUSED,
  STOPPED,
}

export class Timer {
  private static readonly MINUTE_SECONDS = 60;
  private readonly timeChange: BehaviorSubject<number>;
  private readonly stateChange: BehaviorSubject<TimerState> = new BehaviorSubject<TimerState>(TimerState.STOPPED);
  private intervalId: NodeJS.Timeout = null;

  constructor(defaultMinutesValue: number) {
    this.timeChange = new BehaviorSubject<number>(defaultMinutesValue * 60);
  }

  get timeUpdates(): Observable<number> {
    return this.timeChange.pipe(distinctUntilChanged());
  }

  get stateUpdates(): Observable<TimerState> {
    return this.stateChange.pipe(distinctUntilChanged(), observeOn(asapScheduler));
  }

  get time(): number {
    return this.timeChange.value;
  }

  get state(): TimerState {
    return this.stateChange.value;
  }

  start(minutes: number): void {
    if (this.state === TimerState.RUNNING) {
      return;
    }
    if (this.state === TimerState.STOPPED) {
      this.timeChange.next(minutes * Timer.MINUTE_SECONDS);
    }
    this.setInterval();
    this.stateChange.next(TimerState.RUNNING);
  }

  pause(): void {
    if (this.state === TimerState.PAUSED || this.state === TimerState.STOPPED) {
      return;
    }
    this.clearInterval();
    this.stateChange.next(TimerState.PAUSED);
  }

  stop(): void {
    this.clearInterval();
    this.timeChange.next(0);
    this.stateChange.next(TimerState.STOPPED);
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private setInterval(): void {
    this.intervalId = setInterval(() => {
      const nextValue = this.timeChange.value - 1;
      if (nextValue === 0) {
        this.stop();
      }
      this.timeChange.next(nextValue);
    }, 1000);
  }
}
