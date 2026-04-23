import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WorkoutSession } from '../types';

interface Props {
  sessions: WorkoutSession[];
}

interface DataPoint {
  date: string;
  [exerciseName: string]: string | number;
}

const COLORS = [
  '#4ade80', '#60a5fa', '#f472b6', '#fb923c',
  '#a78bfa', '#34d399', '#fbbf24', '#e879f9',
];

export default function ProgressChart({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
        <div className="text-5xl mb-4">📈</div>
        <p className="text-sm">No sessions logged yet.</p>
        <p className="text-xs mt-1">Complete workouts to track your progress.</p>
      </div>
    );
  }

  // Gather all unique exercise names
  const allExercises = new Set<string>();
  sessions.forEach(s =>
    s.exercises.forEach(e => allExercises.add(e.exerciseName))
  );

  // Build data: one row per session, columns = max reps per exercise
  const data: DataPoint[] = sessions
    .slice()
    .sort((a, b) => a.date - b.date)
    .map(s => {
      const dateStr = new Date(s.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const point: DataPoint = { date: dateStr };
      s.exercises.forEach(ex => {
        const maxReps = ex.sets.reduce((acc, set) => Math.max(acc, set.reps), 0);
        point[ex.exerciseName] = maxReps;
      });
      return point;
    });

  const exerciseList = Array.from(allExercises);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-zinc-400 mb-2 font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-zinc-300">{entry.name}:</span>
            <span className="font-bold text-white">{entry.value} reps</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
            label={{ value: 'Reps', angle: -90, position: 'insideLeft', fill: '#52525b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingTop: '12px' }}
          />
          {exerciseList.map((ex, i) => (
            <Line
              key={ex}
              type="monotone"
              dataKey={ex}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ fill: COLORS[i % COLORS.length], r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
