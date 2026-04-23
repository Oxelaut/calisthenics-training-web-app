import { useState, useEffect } from 'react';
import { ParsedWorkout, WorkoutSession } from './types';
import { loadSessions } from './utils/storage';
import FileUploader from './components/FileUploader';
import WorkoutSessionView from './components/WorkoutSession';
import SessionHistory from './components/SessionHistory';
import ProgressChart from './components/ProgressChart';

type Tab = 'workout' | 'history' | 'progress';
type AppState = 'home' | 'active';

export default function App() {
  const [tab, setTab] = useState<Tab>('workout');
  const [appState, setAppState] = useState<AppState>('home');
  const [activeWorkout, setActiveWorkout] = useState<ParsedWorkout | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [justCompleted, setJustCompleted] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const refreshSessions = () => setSessions(loadSessions());

  const handleStartWorkout = (workout: ParsedWorkout) => {
    setActiveWorkout(workout);
    setAppState('active');
    setJustCompleted(null);
  };

  const handleFinish = (session: WorkoutSession) => {
    refreshSessions();
    setJustCompleted(session);
    setAppState('home');
    setActiveWorkout(null);
    setTab('history');
  };

  const handleCancel = () => {
    setAppState('home');
    setActiveWorkout(null);
  };

  if (appState === 'active' && activeWorkout) {
    return (
      <WorkoutSessionView
        sessionName={activeWorkout.sessionName}
        exercises={activeWorkout.exercises}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'workout', label: 'Workout', icon: '🏋️' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'progress', label: 'Progress', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/40">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">CalisForce</h1>
            <p className="text-xs text-zinc-500 leading-none mt-0.5">Train to Failure</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {sessions.length} sessions
        </div>
      </header>

      {/* Just completed banner */}
      {justCompleted && (
        <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-b border-green-700/50 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-green-300 font-bold text-sm">🎉 Session Complete!</p>
            <p className="text-green-500 text-xs">{justCompleted.sessionName} logged successfully</p>
          </div>
          <button onClick={() => setJustCompleted(null)} className="text-green-600 hover:text-green-400 text-lg">×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4">
        <div className="flex gap-1 max-w-lg mx-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-all relative
                ${tab === t.id
                  ? 'text-green-400'
                  : 'text-zinc-500 hover:text-zinc-300'
                }
              `}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {tab === t.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-green-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">

          {/* WORKOUT TAB */}
          {tab === 'workout' && (
            <div className="space-y-6">
              {/* Hero */}
              <div className="text-center py-4">
                <h2 className="text-2xl font-extrabold text-white">Load Your Workout</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Upload a .txt file or use a sample to get started
                </p>
              </div>

              {/* Categories legend */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Push', color: 'bg-green-500/20 text-green-400', icon: '💪' },
                  { label: 'Pull', color: 'bg-blue-500/20 text-blue-400', icon: '🏋️' },
                  { label: 'Legs', color: 'bg-pink-500/20 text-pink-400', icon: '🦵' },
                  { label: 'Core', color: 'bg-orange-500/20 text-orange-400', icon: '🔥' },
                ].map(c => (
                  <div key={c.label} className={`${c.color} rounded-xl p-2.5 text-center`}>
                    <div className="text-lg">{c.icon}</div>
                    <div className="text-xs font-semibold mt-0.5">{c.label}</div>
                  </div>
                ))}
              </div>

              <FileUploader onParsed={handleStartWorkout} />
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h2 className="text-2xl font-extrabold text-white">Session History</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Your past workouts and failure logs
                </p>
              </div>
              <SessionHistory sessions={sessions} onUpdate={refreshSessions} />
            </div>
          )}

          {/* PROGRESS TAB */}
          {tab === 'progress' && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <h2 className="text-2xl font-extrabold text-white">Progress Chart</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Reps to failure over time
                </p>
              </div>

              {/* Stats summary */}
              {sessions.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    label="Sessions"
                    value={sessions.length}
                    color="text-green-400"
                  />
                  <StatCard
                    label="Total Sets"
                    value={sessions.reduce((acc, s) => acc + s.exercises.reduce((a, e) => a + e.sets.length, 0), 0)}
                    color="text-blue-400"
                  />
                  <StatCard
                    label="Total Reps"
                    value={sessions.reduce(
                      (acc, s) => acc + s.exercises.reduce((a, e) => a + e.sets.reduce((x, set) => x + set.reps, 0), 0),
                      0
                    )}
                    color="text-pink-400"
                  />
                </div>
              )}

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-4">
                  Max Reps Per Session
                </p>
                <ProgressChart sessions={sessions} />
              </div>

              {/* Per-exercise best */}
              {sessions.length > 0 && <BestPerExercise sessions={sessions} />}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-zinc-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

function BestPerExercise({ sessions }: { sessions: WorkoutSession[] }) {
  const bestMap: Record<string, number> = {};
  sessions.forEach(s =>
    s.exercises.forEach(ex => {
      const maxReps = ex.sets.reduce((acc, set) => Math.max(acc, set.reps), 0);
      if (!bestMap[ex.exerciseName] || maxReps > bestMap[ex.exerciseName]) {
        bestMap[ex.exerciseName] = maxReps;
      }
    })
  );

  const entries = Object.entries(bestMap).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-4">
        Personal Bests (Max Reps)
      </p>
      <div className="space-y-2">
        {entries.map(([name, reps], i) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-zinc-600 text-xs w-5 text-right">{i + 1}.</span>
            <div className="flex-1 bg-zinc-800 rounded-lg h-8 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600/40 to-emerald-500/20 rounded-lg transition-all duration-700"
                style={{ width: `${Math.min(100, (reps / (entries[0][1] || 1)) * 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-sm text-zinc-300 font-medium truncate">{name}</span>
                <span className="text-sm font-bold text-white shrink-0 ml-2">{reps}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
