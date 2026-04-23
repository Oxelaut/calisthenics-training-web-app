// Generate a beep sound using the Web Audio API
export function playBeep(frequency = 880, duration = 0.3, volume = 0.5): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    oscillator.onended = () => ctx.close();
  } catch (e) {
    console.warn('Audio not supported', e);
  }
}

export function playRestComplete(): void {
  // Three ascending beeps
  playBeep(660, 0.15, 0.4);
  setTimeout(() => playBeep(770, 0.15, 0.4), 180);
  setTimeout(() => playBeep(880, 0.3, 0.5), 360);
}

export function playTick(): void {
  playBeep(440, 0.08, 0.2);
}
