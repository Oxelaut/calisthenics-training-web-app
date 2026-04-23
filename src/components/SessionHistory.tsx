import { useState } from 'react';
import { WorkoutSession } from '../types';
import { deleteSession, clearAllSessions } from '../utils/storage';

interface Props {
  sessions: WorkoutSession[];
  onUpdate: () => void;
}

export default function SessionHistory({ sessions, onUpdate }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <div className="text-5xl mb-4">🗂️</div>
        <p className="text-sm">No sessions recorded yet.</p>
        <p className="text-xs mt-1">Complete a workout to see it here.</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteSession(id);
    onUpdate();
  };

  const handleClear = () => {
    clearAllSessions();
    onUpdate();
    setConfirmClear(false);
  };



  return (
    <div className="space-y-4">
      {/* Clear all */}
      <div className="flex justify-end">
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Are you sure?</span>
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              Yes, clear all
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
          >
            Clear All History
          </button>
        )}
      </div>

      {sessions.map(session => {
        const date = new Date(session.date);
        const dateStr = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const totalReps = session.exercises.reduce(
          (acc, ex) => acc + ex.sets.reduce((a, s) => a + s.reps, 0),
          0
        );
        const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const isOpen = expanded === session.id;

        return (
          <div
            key={session.id}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
          >
            {/* Session header */}
            <button
              onClick={() => setExpanded(isOpen ? null : session.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate">{session.sessionName}</h3>
                  {session.completed && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {dateStr} · {timeStr}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-white">{totalReps} reps</div>
                <div className="text-xs text-zinc-500">{totalSets} sets</div>
              </div>
              <span className="text-zinc-600 text-sm">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-zinc-800 pt-4 space-y-4">
                {session.exercises.map(ex => (
                  <div key={ex.exerciseId}>
                    <p className="text-sm font-semibold text-zinc-300 mb-2">{ex.exerciseName}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ex.sets.map(s => (
                        <div
                          key={s.setNumber}
                          className="bg-zinc-800 rounded-xl px-3 py-2 text-center"
                        >
                          <div className="text-xs text-zinc-500 mb-0.5">Set {s.setNumber}</div>
                          <div className="text-lg font-black text-white">{s.reps}</div>
                          <div className="text-xs text-red-400">💀</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Failure log */}
                <div className="bg-zinc-800 rounded-xl p-3 mt-2">
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-2">Failure Log</p>
                  {session.exercises.flatMap(ex =>
                    ex.sets.filter(s => s.reachedFailure).map(s => (
                      <div key={`${ex.exerciseId}-${s.setNumber}`} className="flex items-center justify-between text-xs text-zinc-400 py-1 border-b border-zinc-700 last:border-0">
                        <span>{ex.exerciseName} — Set {s.setNumber}</span>
                        <span className="font-bold text-white">{s.reps} reps</span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => handleDelete(session.id)}
                  className="w-full py-2 rounded-xl border border-zinc-700 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
                >
                  Delete Session
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
