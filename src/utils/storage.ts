import { WorkoutSession } from '../types';

const KEY = 'calisforce_sessions';

export function loadSessions(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: WorkoutSession): void {
  const sessions = loadSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function deleteSession(id: string): void {
  const sessions = loadSessions().filter(s => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function clearAllSessions(): void {
  localStorage.removeItem(KEY);
}
