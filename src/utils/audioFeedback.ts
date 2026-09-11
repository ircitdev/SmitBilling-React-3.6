/**
 * Lightweight Web Audio API synthesizer for UI sound feedback
 * Zero dependencies, works across modern browsers without external audio files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a pleasant, subtle harmonic success chord chime
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonious chord notes: F5 (698.46 Hz) -> A5 (880 Hz) -> C6 (1046.5 Hz)
    const notes = [
      { freq: 698.46, delay: 0, duration: 0.35, gain: 0.08 },
      { freq: 880.0, delay: 0.09, duration: 0.45, gain: 0.1 },
      { freq: 1046.5, delay: 0.18, duration: 0.6, gain: 0.09 },
    ];

    notes.forEach(({ freq, delay, duration, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Soft sine wave for clean, calm chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      // Smooth attack and exponential decay envelope
      gainNode.gain.setValueAtTime(0.0001, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + delay + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.05);
    });
  } catch {
    // Fail silently if audio is muted or blocked by browser autoplay policy
  }
}
