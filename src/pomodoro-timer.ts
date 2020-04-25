import { Timer, TimerState } from './timer';
import { distinctUntilChanged, observeOn, skip } from 'rxjs/internal/operators';
import { asapScheduler, Observable, Subject } from 'rxjs';

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

export interface StageChange {
  stage: PomodoroStage;
  type: 'started' | 'finished';
}

export class PomodoroTimer {
  private cycle = 0;
  private timer: Timer = new Timer(work.time);
  private _stage: PomodoroStage = work;
  private readonly stageChange: Subject<StageChange> = new Subject<StageChange>();

  constructor() {
    this.timer.stateUpdates.pipe(skip(1)).subscribe((state) => {
      if (state === TimerState.STOPPED) {
        this.changeStage();
      }
    });
  }

  get stage(): PomodoroStage {
    return this._stage;
  }

  get timeUpdates(): Observable<number> {
    return this.timer.timeUpdates;
  }

  get stateUpdates(): Observable<TimerState> {
    return this.timer.stateUpdates;
  }

  get stageUpdates(): Observable<StageChange> {
    return this.stageChange.pipe(distinctUntilChanged(), observeOn(asapScheduler));
  }

  get time(): number {
    return this.timer.time;
  }

  get state(): TimerState {
    return this.timer.state;
  }

  start(): void {
    this.stageChange.next({ stage: this._stage, type: 'started' });
    this.timer.start(this._stage.time);
  }

  pause(): void {
    this.timer.pause();
  }

  private changeStage(): void {
    this.stageChange.next({ stage: this._stage, type: 'finished' });
    switch (this._stage.id) {
      case 'work':
        if (this.cycle < 3) {
          this._stage = shortBreak;
        } else {
          this._stage = longBreak;
        }
        this.start();
        break;
      case 'shortBreak':
        this._stage = work;
        this.cycle++;
        this.start();
        break;
      case 'longBreak':
        this._stage = work;
        this.cycle = 0;
        break;
    }
  }
}
