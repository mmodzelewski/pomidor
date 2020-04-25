import './index.css';
import { TimerState } from './timer';

const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const time = document.getElementById('time');
const stageText = document.getElementById('stageText');
const timer = window.timer;

function formatTime(timeInSeconds: number): string {
  const seconds = timeInSeconds % 60;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;
  const minutes = (timeInSeconds - seconds) / 60;
  return `${minutes}:${secondsToDisplay}`;
}

timer.timeUpdates.subscribe((remainingTime) => (time.innerText = formatTime(remainingTime)));

timer.stateUpdates.subscribe((state) => {
  switch (state) {
    case TimerState.RUNNING:
      startButton.hidden = true;
      pauseButton.hidden = false;
      break;
    case TimerState.PAUSED:
    case TimerState.STOPPED:
      startButton.hidden = false;
      pauseButton.hidden = true;
      break;
  }
});

timer.stageUpdates.subscribe((stageUpdate) => {
  if (stageUpdate.type === 'started') {
    switch (stageUpdate.stage.id) {
      case 'work':
        stageText.innerText = 'WORK';
        break;
      case 'shortBreak':
      case 'longBreak':
        stageText.innerText = 'BREAK';
        break;
    }
  }
});

startButton.addEventListener('click', () => timer.start());

pauseButton.addEventListener('click', () => timer.pause());
