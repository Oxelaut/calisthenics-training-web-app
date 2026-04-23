import { useState } from 'react';
import { Exercise, ExerciseLog, SetLog, WorkoutSession } from '../types';
import ExerciseAnimation from './ExerciseAnimation';
import RestTimer from './RestTimer';
import { saveSession } from '../utils/storage';

interface Props {
  sessionName: string;
  exercises: Exercise[];
  onFinish: (session: WorkoutSession) => void;
  onCancel: () => void;
}

type Phase = 'exercise' | 'rest' | 'complete';

export default function WorkoutSessionView({ sessionName, exercises, onFinish, onCancel }: Props) {
  const [exIdx, setExIdx] = useState(0);
  const [setNum, setSetNum] = useState(1);
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [animPulse, setAnimPulse] = useState(false);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);

  const currentEx = exercises[exIdx];
  const totalExercises = exercises.length;

  const currentExLog = (): ExerciseLog =>
    logs.find(l => l.exerciseId === currentEx.id) || {
      exerciseId: currentEx.id,
      exerciseName: currentEx.name,
      sets: [],
    };

  const handleRepChange = (delta: number) => {
    setReps(r => Math.max(0, r + delta));
    setAnimPulse(true);
    setTimeout(() => setAnimPulse(false), 150);
  };

  const handleFailure = () => {
    const setLog: SetLog = {
      setNumber: setNum,
      reps,
      reachedFailure: true,
      timestamp: Date.now(),
    };

    const existingLog = currentExLog();
    const updatedLog: ExerciseLog = {
      ...existingLog,
      sets: [...existingLog.sets, setLog],
    };

    const updatedLogs = [
      ...logs.filter(l => l.exerciseId !== currentEx.id),
      updatedLog,
    ];
    setLogs(updatedLogs);

    const isLastSet = setNum >= currentEx.sets;
    const isLastExercise = exIdx >= totalExercises - 1;

    if (isLastSet && isLastExercise) {
      finishWorkout(updatedLogs);
    } else {
      setPhase('rest');
    }
  };

  const handleRestComplete = () => {
    const isLastSet = setNum >= currentEx.sets;
    if (isLastSet) {
      setExIdx(i => i + 1);
      setSetNum(1);
    } else {
      setSetNum(s => s + 1);
    }
    setReps(0);
    setPhase('exercise');
  };

  const finishWorkout = (finalLogs: ExerciseLog[]) => {
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      sessionName,
      date: Date.now(),
      exercises: finalLogs,
      completed: true,
    };
    saveSession(session);
    setCompletedSession(session);
    setPhase('complete');
  };

  const categoryColors: Record<string, string> = {
    push: 'text-green-400',
    pull: 'text-blue-400',
    legs: 'text-pink-400',
    core: 'text-orange-400',
  };

  const categoryBg: Record<string, string> = {
    push: 'bg-green-500/10 border-green-500/30',
    pull: 'bg-blue-500/10 border-blue-500/30',
    legs: 'bg-pink-500/10 border-pink-500/30',
    core: 'bg-orange-500/10 border-orange-500/30',
  };

  const progressPct = phase === 'complete'
    ? 100
    : ((exIdx + (setNum - 1) / currentEx.sets) / totalExercises) * 100;

  const completedSets = phase !== 'complete' ? currentExLog().sets : [];

  /* ─── COMPLETE SCREEN ─── */
  if (phase === 'complete' && completedSession) {
    const totalReps = completedSession.exercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((a, s) => a + s.reps, 0),
      0
    );
    const totalSets = completedSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        {/* Confetti emoji burst */}
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-extrabold text-white mb-1">Session Complete!</h2>
        <p className="text-zinc-500 mb-8">{sessionName}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 text-center">
            <div className="text-3xl font-black text-green-400">{totalSets}</div>
            <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">Total Sets</div>
          </div>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 text-center">
            <div className="text-3xl font-black text-blue-400">{totalReps}</div>
            <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">Total Reps</div>
          </div>
        </div>

        {/* Exercise summary */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {completedSession.exercises.map(ex => {
            const maxReps = ex.sets.reduce((acc, s) => Math.max(acc, s.reps), 0);
            return (
              <div key={ex.exerciseId} className="bg-zinc-900 rounded-xl border border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">{ex.exerciseName}</p>
                  <p className="text-xs text-zinc-500">{ex.sets.length} sets completed</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-white">{maxReps}</p>
                  <p className="text-xs text-zinc-500">peak reps</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onFinish(completedSession)}
          className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-lg shadow-lg shadow-green-900/40 transition-all active:scale-95"
        >
          View History →
        </button>
      </div>
    );
  }

  /* ─── ACTIVE WORKOUT ─── */
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg text-white">{sessionName}</h1>
          <p className="text-xs text-zinc-500">
            Exercise {exIdx + 1}/{totalExercises} · Set {setNum}/{currentEx.sets}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-zinc-500 hover:text-red-400 text-sm transition-colors px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-red-500/50"
        >
          End Session
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 gap-6 max-w-lg mx-auto w-full pt-6">

        {/* Exercise Card */}
        <div className={`w-full rounded-2xl border p-6 ${categoryBg[currentEx.category]}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${categoryColors[currentEx.category]}`}>
                {currentEx.category}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{currentEx.name}</h2>
            </div>
            <div className="text-right text-sm text-zinc-400">
              <div className="font-semibold text-white">{currentEx.sets} sets</div>
              <div>{currentEx.rest}s rest</div>
            </div>
          </div>

          {/* SVG Animation */}
          <div className="flex justify-center my-2">
            <ExerciseAnimation category={currentEx.category} active={phase === 'exercise'} />
          </div>
        </div>

        {/* ── Exercise Phase ── */}
        {phase === 'exercise' && (
          <div className="w-full space-y-5">
            {/* Set badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-1.5 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Set {setNum} of {currentEx.sets}
              </span>
            </div>

            {/* Rep counter */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-4 font-semibold">
                Reps Counted
              </p>
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => handleRepChange(-1)}
                  className="w-14 h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-2xl font-bold transition-all active:scale-95 flex items-center justify-center text-red-400 select-none"
                >
                  −
                </button>
                <span
                  className="text-6xl font-black tabular-nums w-20 text-center"
                  style={{ transition: 'transform 0.1s ease', transform: animPulse ? 'scale(1.3)' : 'scale(1)' }}
                >
                  {reps}
                </span>
                <button
                  onClick={() => handleRepChange(1)}
                  className="w-14 h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-2xl font-bold transition-all active:scale-95 flex items-center justify-center text-green-400 select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Failure button */}
            <button
              onClick={handleFailure}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg shadow-lg shadow-red-900/40 transition-all active:scale-95"
            >
              💀 Reached Failure
            </button>

            {/* Previous sets for this exercise */}
            {completedSets.length > 0 && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-semibold">
                  Completed Sets
                </p>
                <div className="space-y-2">
                  {completedSets.map(s => (
                    <div key={s.setNumber} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Set {s.setNumber}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{s.reps} reps</span>
                        <span className="text-red-400 text-xs bg-red-500/10 px-2 py-0.5 rounded-full">💀 Failure</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise list overview */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-semibold">
                Today's Plan
              </p>
              <div className="space-y-1.5">
                {exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 ${
                      idx === exIdx
                        ? 'bg-zinc-700 text-white font-semibold'
                        : idx < exIdx
                        ? 'text-zinc-600 line-through'
                        : 'text-zinc-500'
                    }`}
                  >
                    <span className="text-xs">
                      {idx < exIdx ? '✓' : idx === exIdx ? '▶' : '·'}
                    </span>
                    <span className="truncate">{ex.name}</span>
                    <span className="ml-auto text-xs opacity-60">{ex.sets}×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Rest Phase ── */}
        {phase === 'rest' && (
          <div className="w-full bg-zinc-900 rounded-2xl border border-zinc-800">
            <RestTimer
              duration={currentEx.rest}
              onComplete={handleRestComplete}
              onSkip={handleRestComplete}
            />
            <div className="px-6 pb-5 text-center">
              <p className="text-zinc-400 text-sm font-medium">
                Next: {(() => {
                  const isLastSet = setNum >= currentEx.sets;
                  if (isLastSet && exIdx < totalExercises - 1) {
                    return exercises[exIdx + 1].name;
                  }
                  return `Set ${setNum + 1} of ${currentEx.sets}`;
                })()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
