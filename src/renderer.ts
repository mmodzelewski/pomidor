import './index.css';
import { Timer } from './timer';
import { Subscription } from 'rxjs';

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const time = document.getElementById('time');
const timer = new Timer();
let subscription: Subscription = null;

startButton.addEventListener('click', () => {
  if (!subscription) {
    subscription = timer.start().subscribe(remainingTime => time.innerText = formatTime(remainingTime));
  }
});

stopButton.addEventListener('click', () => {
  if (!!subscription) {
    timer.stop();
    subscription.unsubscribe();
    subscription = null;
  }
});

function formatTime(timeInSeconds: number): string {
  const seconds = timeInSeconds % 60;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;
  const minutes = (timeInSeconds - seconds) / 60;
  return `${minutes}:${secondsToDisplay}`;
}
