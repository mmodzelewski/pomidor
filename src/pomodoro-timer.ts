import { Timer, TimerState } from './timer';
import { distinctUntilChanged, observeOn, skip } from 'rxjs/internal/operators';
import { asapScheduler, BehaviorSubject, Observable } from 'rxjs';

export interface PomodoroStage {
  id: 'work' | 'shortBreak' | 'longBreak';
  time: number;
}

const work: PomodoroStage = {
  id: 'work',
  time: 25,
};

const shortBreak: PomodoroStage = {
  id: 'shortBreak',
  time: 5,
};

const longBreak: PomodoroStage = {
  id: 'longBreak',
  time: 15,
};

export class PomodoroTimer {
  private cycle = 0;
  private timer: Timer = new Timer(work.time);
  private readonly stageChange: BehaviorSubject<PomodoroStage> = new BehaviorSubject<PomodoroStage>(work);

  constructor() {
    this.timer.stateUpdates.pipe(skip(1)).subscribe((state) => {
      if (state === TimerState.STOPPED) {
        this.changeStage();
      }
    });
  }

  get timeUpdates(): Observable<number> {
    return this.timer.timeUpdates;
  }

  get stateUpdates(): Observable<TimerState> {
    return this.timer.stateUpdates;
  }

  get stageUpdates(): Observable<PomodoroStage> {
    return this.stageChange.pipe(distinctUntilChanged(), observeOn(asapScheduler));
  }

  get stage(): PomodoroStage {
    return this.stageChange.value;
  }

  get time(): number {
    return this.timer.time;
  }

  get state(): TimerState {
    return this.timer.state;
  }

  start(): void {
    this.timer.start(this.stage.time);
  }

  pause(): void {
    this.timer.pause();
  }

  private changeStage(): void {
    switch (this.stage.id) {
      case 'work':
        if (this.cycle < 3) {
          this.stageChange.next(shortBreak);
        } else {
          this.stageChange.next(longBreak);
        }
        this.start();
        break;
      case 'shortBreak':
        this.stageChange.next(work);
        this.cycle++;
        this.start();
        break;
      case 'longBreak':
        this.stageChange.next(work);
        this.cycle = 0;
        break;
    }
  }
}
