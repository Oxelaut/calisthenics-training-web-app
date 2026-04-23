import { ExerciseCategory } from '../types';

interface Props {
  category: ExerciseCategory;
  active?: boolean;
}

export default function ExerciseAnimation({ category, active = true }: Props) {
  if (category === 'push') return <PushAnimation active={active} />;
  if (category === 'pull') return <PullAnimation active={active} />;
  if (category === 'legs') return <SquatAnimation active={active} />;
  return <CoreAnimation active={active} />;
}

/* ────────── PUSH (push-up figure) ────────── */
function PushAnimation({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`w-28 h-20 ${active ? 'animate-push' : ''}`}
      aria-label="Push exercise animation"
    >
      {/* Ground */}
      <line x1="10" y1="70" x2="110" y2="70" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      {/* Body silhouette - push-up position */}
      <g className={active ? 'push-body' : ''}>
        {/* Head */}
        <circle cx="95" cy="30" r="7" fill="#a3e635" />
        {/* Torso */}
        <line x1="88" y1="34" x2="50" y2="48" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" />
        {/* Arms */}
        <line x1="88" y1="34" x2="82" y2="55" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        <line x1="82" y1="55" x2="78" y2="70" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="40" x2="66" y2="56" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        <line x1="66" y1="56" x2="62" y2="70" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="50" y1="48" x2="35" y2="62" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" />
        <line x1="35" y1="62" x2="28" y2="70" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        <line x1="46" y1="52" x2="32" y2="66" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ────────── PULL (pull-up figure) ────────── */
function PullAnimation({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={`w-28 h-24 ${active ? 'animate-pull' : ''}`}
      aria-label="Pull exercise animation"
    >
      {/* Bar */}
      <rect x="15" y="8" width="90" height="5" rx="2.5" fill="#60a5fa" />
      {/* Hands gripping */}
      <circle cx="42" cy="13" r="4" fill="#93c5fd" />
      <circle cx="78" cy="13" r="4" fill="#93c5fd" />
      {/* Body */}
      <g className={active ? 'pull-body' : ''}>
        {/* Head */}
        <circle cx="60" cy="28" r="7" fill="#60a5fa" />
        {/* Neck */}
        <line x1="60" y1="35" x2="60" y2="42" stroke="#60a5fa" strokeWidth="3" />
        {/* Arms up */}
        <line x1="42" y1="13" x2="55" y2="38" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
        <line x1="78" y1="13" x2="65" y2="38" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
        {/* Torso */}
        <line x1="60" y1="42" x2="60" y2="62" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
        {/* Legs */}
        <line x1="60" y1="62" x2="54" y2="78" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="62" x2="66" y2="78" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ────────── LEGS (squat figure) ────────── */
function SquatAnimation({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={`w-28 h-24 ${active ? 'animate-squat' : ''}`}
      aria-label="Squat exercise animation"
    >
      {/* Ground */}
      <line x1="10" y1="82" x2="110" y2="82" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
      <g className={active ? 'squat-body' : ''}>
        {/* Head */}
        <circle cx="60" cy="16" r="7" fill="#f472b6" />
        {/* Torso */}
        <line x1="60" y1="23" x2="60" y2="48" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
        {/* Arms out */}
        <line x1="60" y1="32" x2="40" y2="38" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="32" x2="80" y2="38" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        {/* Thighs (in squat) */}
        <line x1="60" y1="48" x2="44" y2="64" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="48" x2="76" y2="64" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
        {/* Shins */}
        <line x1="44" y1="64" x2="38" y2="82" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        <line x1="76" y1="64" x2="82" y2="82" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        {/* Feet */}
        <line x1="34" y1="82" x2="46" y2="82" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        <line x1="76" y1="82" x2="88" y2="82" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ────────── CORE (plank figure) ────────── */
function CoreAnimation({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`w-28 h-20 ${active ? 'animate-core' : ''}`}
      aria-label="Core exercise animation"
    >
      {/* Ground */}
      <line x1="10" y1="68" x2="110" y2="68" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
      <g className={active ? 'core-body' : ''}>
        {/* Head */}
        <circle cx="96" cy="36" r="6" fill="#fb923c" />
        {/* Body plank */}
        <line x1="90" y1="40" x2="40" y2="52" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" />
        {/* Forearms */}
        <line x1="74" y1="44" x2="74" y2="68" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
        <line x1="56" y1="49" x2="56" y2="68" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="40" y1="52" x2="26" y2="62" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="62" x2="22" y2="68" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
