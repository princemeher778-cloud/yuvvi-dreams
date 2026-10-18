// Web Audio API Synthesizer for "A Dream After Midnight" soundscapes
// Zero external files, 100% reliable, lightweight, and soothing

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(val) {
    this.muted = !!val;
  }

  // Soft celestial chime (single or chord)
  playChime(freq = 523.25, type = 'sine', duration = 1.2) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, this.ctx.currentTime + duration * 0.5);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback silently guarded
    }
  }

  // Soft magical flight whoosh as Yuvvi takes off
  playFlightWhoosh() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      // Soft filtered noise/sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.9);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch {
      // Fallback
    }
  }

  // Delicate star sparkle when destination star emerges
  playStarReveal() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playChime(freq, 'sine', 0.8);
        }, i * 65);
      });
    } catch {
      // Fallback
    }
  }

  // Sparkling ascending twinkle for collecting stars
  playStarCollect() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playChime(freq, 'sine', 0.9);
        }, i * 80);
      });
    } catch {
      // Fallback
    }
  }

  // Warm resonant lantern bell / surge
  playLanternGlow() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const baseFreq = 440; // A4
      const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2]; // A major 7th feel

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.8);
      });
    } catch {
      // Fallback
    }
  }

  // Delicate harp cascade when planting a wish
  playWishPlanted() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const arpeggio = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51];
      arpeggio.forEach((f, i) => {
        setTimeout(() => {
          this.playChime(f, 'sine', 0.85);
        }, i * 65);
      });
    } catch {
      // Fallback
    }
  }

  // Grand celestial victory fanfare when all 5 stars collected
  playConstellationFanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const progression = [
        { f: 523.25, d: 0 },
        { f: 659.25, d: 110 },
        { f: 783.99, d: 220 },
        { f: 1046.50, d: 330 },
        { f: 1318.51, d: 470 },
        { f: 1567.98, d: 620 },
        { f: 2093.00, d: 800 }
      ];

      progression.forEach(({ f, d }) => {
        setTimeout(() => {
          this.playChime(f, 'sine', 1.8);
        }, d);
      });
    } catch {
      // Fallback
    }
  }
}

export const sound = new SoundEffects();
