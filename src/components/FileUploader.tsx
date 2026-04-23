import { useRef, useState } from 'react';
import { ParsedWorkout } from '../types';
import { parseTxtWorkout } from '../utils/parser';

interface Props {
  onParsed: (workout: ParsedWorkout) => void;
}

const SAMPLE_TXT = `SESSION: Push Day
EXERCISE: Push-ups
SETS: 4
REST: 60

EXERCISE: Dips
SETS: 3
REST: 90

EXERCISE: Diamond Push-ups
SETS: 3
REST: 75

EXERCISE: Pike Press
SETS: 3
REST: 60`;

export default function FileUploader({ onParsed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<ParsedWorkout | null>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file.');
      return;
    }
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      try {
        const parsed = parseTxtWorkout(text);
        setPreview(parsed);
      } catch {
        setError('Could not parse file. Check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const loadSample = () => {
    const parsed = parseTxtWorkout(SAMPLE_TXT);
    setFileName('sample_push_day.txt');
    setPreview(parsed);
    setError('');
  };

  const categoryColors: Record<string, string> = {
    push: 'text-green-400',
    pull: 'text-blue-400',
    legs: 'text-pink-400',
    core: 'text-orange-400',
  };

  const categoryIcons: Record<string, string> = {
    push: '💪',
    pull: '🏋️',
    legs: '🦵',
    core: '🔥',
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
          ${dragging
            ? 'border-green-400 bg-green-400/10'
            : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
        <div className="text-4xl mb-3">📄</div>
        <p className="text-white font-semibold">
          {fileName || 'Drop your .txt workout file here'}
        </p>
        <p className="text-zinc-500 text-sm mt-1">
          {fileName ? 'Click to change file' : 'or click to browse'}
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Sample button */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <button
        onClick={loadSample}
        className="w-full py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-sm font-medium transition-all"
      >
        Load Sample Push Day 📋
      </button>

      {/* Format hint */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-2">File Format</p>
        <pre className="text-xs text-zinc-400 leading-relaxed font-mono">{`SESSION: Push Day
EXERCISE: Push-ups
SETS: 4
REST: 60

EXERCISE: Dips
SETS: 3
REST: 90`}</pre>
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-5 space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Session Preview</p>
            <h3 className="text-xl font-bold text-white mt-1">{preview.sessionName}</h3>
            <p className="text-zinc-500 text-sm">{preview.exercises.length} exercises</p>
          </div>
          <div className="space-y-2">
            {preview.exercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3">
                <span className="text-lg">{categoryIcons[ex.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{ex.name}</p>
                  <p className="text-zinc-500 text-xs">{ex.sets} sets · {ex.rest}s rest</p>
                </div>
                <span className={`text-xs font-bold uppercase ${categoryColors[ex.category]}`}>
                  {ex.category}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onParsed(preview)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-green-900/30 transition-all active:scale-95"
          >
            🚀 Start Workout
          </button>
        </div>
      )}
    </div>
  );
}
