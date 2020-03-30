import './index.css';

const startButton = document.getElementById('start');
const stopButton = document.getElementById('pause');
const time = document.getElementById('time');
const timer = window.timer;

function formatTime(timeInSeconds: number): string {
  const seconds = timeInSeconds % 60;
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds;
  const minutes = (timeInSeconds - seconds) / 60;
  return `${minutes}:${secondsToDisplay}`;
}

timer.updates.subscribe((remainingTime) => (time.innerText = formatTime(remainingTime)));

startButton.addEventListener('click', () => timer.start());

stopButton.addEventListener('click', () => timer.stop());
