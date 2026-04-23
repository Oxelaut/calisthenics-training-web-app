import { Exercise, ExerciseCategory, ParsedWorkout } from '../types';

function categorize(name: string): ExerciseCategory {
  const lower = name.toLowerCase();
  if (/push|dip|press|tricep|chest|diamond/.test(lower)) return 'push';
  if (/pull|row|chin|lat|curl|bicep|inverted/.test(lower)) return 'pull';
  if (/squat|lunge|pistol|leg|calf|step|jump/.test(lower)) return 'legs';
  return 'core';
}

export function parseTxtWorkout(text: string): ParsedWorkout {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let sessionName = 'Custom Session';
  const exercises: Exercise[] = [];

  let currentName = '';
  let currentSets = 3;
  let currentRest = 60;

  const flush = () => {
    if (currentName) {
      exercises.push({
        id: `ex-${Date.now()}-${Math.random()}`,
        name: currentName,
        sets: currentSets,
        rest: currentRest,
        category: categorize(currentName),
      });
    }
  };

  for (const line of lines) {
    if (line.startsWith('SESSION:')) {
      sessionName = line.replace('SESSION:', '').trim();
    } else if (line.startsWith('EXERCISE:')) {
      flush();
      currentName = line.replace('EXERCISE:', '').trim();
      currentSets = 3;
      currentRest = 60;
    } else if (line.startsWith('SETS:')) {
      currentSets = parseInt(line.replace('SETS:', '').trim(), 10) || 3;
    } else if (line.startsWith('REST:')) {
      currentRest = parseInt(line.replace('REST:', '').trim(), 10) || 60;
    }
  }
  flush();

  return { sessionName, exercises };
}
