import { WebClient } from '@slack/web-api';
import { PomodoroTimer } from './pomodoro-timer';

let web: WebClient;
const apiToken: string = null;

if (apiToken) {
  web = new WebClient(apiToken);
}

function setPomodoroStatus(): void {
  web.users.profile.set({
    profile: {
      'status_text': 'Pomodoro',
      'status_emoji': ':tomato:',
    } as any,
  });
  web.dnd.setSnooze({
    'num_minutes': 90,
  });
}

function clearStatus(): void {
  web.users.profile.set({
    profile: {
      'status_text': '',
      'status_emoji': '',
    } as any,
  });
  web.dnd.endSnooze();
}

export function addSlackHandlers(timer: PomodoroTimer): void {
  if (!web) {
    return;
  }
  timer.stageUpdates.subscribe((stageChange) => {
    if (stageChange.stage.id === 'work') {
      switch (stageChange.type) {
        case 'started':
          setPomodoroStatus();
          break;
        case 'finished':
          clearStatus();
          break;
      }
    }
  });
}
