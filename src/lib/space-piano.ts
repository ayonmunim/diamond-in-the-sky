/** Original "Little Star Voyage": warm piano-style synthesis, 76 BPM, eight bars. */
const MELODY = [
  [72, 76, 79, null, 81, 79, 76, null],
  [77, 81, 84, null, 81, 79, 77, null],
  [76, 79, 81, 84, 83, 81, 79, null],
  [74, 79, 83, null, 81, 79, 74, null],
  [76, 79, 84, null, 86, 84, 79, null],
  [77, 81, 84, 81, 79, 77, 76, null],
  [76, 81, 84, null, 83, 79, 76, 74],
  [74, 79, 83, null, 79, 76, 72, null],
];
const CHORDS = [
  [48, 55, 60, 64],
  [41, 48, 57, 60],
  [45, 52, 57, 60],
  [43, 50, 55, 59],
];
const EIGHTH = 60 / 76 / 2;

export function createSpacePiano(ac: AudioContext, volume: number) {
  const master = ac.createGain();
  master.gain.setValueAtTime(0, ac.currentTime);
  master.gain.linearRampToValueAtTime(
    Math.max(0, Math.min(1, volume)) * 0.38,
    ac.currentTime + 0.4,
  );
  master.connect(ac.destination);
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 3400;
  tone.Q.value = 0.3;
  tone.connect(master);
  const delay = ac.createDelay(1);
  delay.delayTime.value = EIGHTH * 0.75;
  const feedback = ac.createGain();
  feedback.gain.value = 0.18;
  const wet = ac.createGain();
  wet.gain.value = 0.14;
  tone.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);
  const voices = new Set<OscillatorNode>();
  let stopped = false,
    step = 0,
    next = ac.currentTime + 0.05;

  function note(midi: number, at: number, strength: number) {
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    // Soft hammer attack; upper harmonics decay faster than the fundamental.
    [
      [1, 1, 2.4],
      [2, 0.24, 1.1],
      [3.003, 0.08, 0.55],
    ].forEach(([partial, weight, decay]) => {
      const oscillator = ac.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency * partial;
      const envelope = ac.createGain();
      envelope.gain.setValueAtTime(0.00001, at);
      envelope.gain.linearRampToValueAtTime(strength * weight, at + 0.009);
      envelope.gain.exponentialRampToValueAtTime(0.00001, at + decay);
      oscillator.connect(envelope);
      envelope.connect(tone);
      voices.add(oscillator);
      oscillator.onended = () => {
        voices.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(at);
      oscillator.stop(at + decay + 0.02);
    });
  }
  function schedule() {
    if (stopped) return;
    // Discard a missed scheduling window rather than playing a burst of notes.
    if (next < ac.currentTime - 0.2) next = ac.currentTime + 0.03;
    while (next < ac.currentTime + 0.18) {
      const bar = Math.floor(step / 8) % 8,
        beat = step % 8;
      const melody = MELODY[bar][beat];
      if (melody !== null) note(melody, next, beat % 2 === 0 ? 0.16 : 0.115);
      if (beat % 2 === 0) note(CHORDS[bar % 4][beat / 2], next, 0.13);
      step = (step + 1) % 64;
      next += EIGHTH;
    }
  }
  schedule();
  const timer = window.setInterval(schedule, 50);
  return {
    setVolume(value: number) {
      if (!stopped)
        master.gain.setTargetAtTime(Math.max(0, Math.min(1, value)) * 0.38, ac.currentTime, 0.08);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(0, ac.currentTime, 0.02);
      for (const voice of voices) {
        try {
          voice.stop(ac.currentTime + 0.1);
        } catch {
          /* Already ended. */
        }
      }
      window.setTimeout(() => {
        master.disconnect();
        tone.disconnect();
        delay.disconnect();
        feedback.disconnect();
        wet.disconnect();
      }, 150);
    },
  };
}
