class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private ambientNode: OscillatorNode | null = null;
  private ambientWobbleNode: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private wantsAmbient = false;

  init() {
    if (typeof window === 'undefined' || this.ctx) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.05;
    this.gainNode.connect(this.ctx.destination);

    // Unlock audio on first interaction so sounds work reliably across browsers.
    const unlock = () => {
      void this.ensureReady();
      if (this.wantsAmbient && !this.muted) this.ambient(true);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  private async ensureReady() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    return this.ctx.state === 'running';
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.gainNode) this.gainNode.gain.value = muted ? 0 : 0.05;
    if (!muted && this.wantsAmbient) this.ambient(true);
  }

  private chirp(config: {
    type: OscillatorType;
    start: number;
    end: number;
    duration?: number;
    volume?: number;
  }) {
    void this.playChirp(config);
  }

  private async playChirp({ type, start, end, duration = 0.14, volume = 0.08 }: {
    type: OscillatorType;
    start: number;
    end: number;
    duration?: number;
    volume?: number;
  }) {
    if (this.muted) return;
    const ok = await this.ensureReady();
    if (!ok || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + duration);

    lfo.type = 'sine';
    lfo.frequency.value = 8;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    osc.stop(now + duration + 0.01);
    lfo.stop(now + duration + 0.01);
  }

  jump() {
    this.chirp({ type: 'triangle', start: 300, end: 520, duration: 0.12, volume: 0.075 });
  }

  token() {
    this.chirp({ type: 'triangle', start: 740, end: 1050, duration: 0.16, volume: 0.1 });
    setTimeout(() => this.chirp({ type: 'sine', start: 920, end: 1280, duration: 0.1, volume: 0.08 }), 40);
  }

  click() {
    this.chirp({ type: 'sine', start: 520, end: 760, duration: 0.08, volume: 0.06 });
  }

  oops() {
    this.chirp({ type: 'sawtooth', start: 260, end: 150, duration: 0.14, volume: 0.07 });
  }

  tada() {
    this.chirp({ type: 'triangle', start: 620, end: 900, duration: 0.12, volume: 0.09 });
    setTimeout(() => this.chirp({ type: 'triangle', start: 780, end: 1180, duration: 0.14, volume: 0.1 }), 90);
    setTimeout(() => this.chirp({ type: 'sine', start: 980, end: 1380, duration: 0.18, volume: 0.09 }), 170);
  }

  ambient(on: boolean) {
    this.wantsAmbient = on;
    this.init();
    if (!this.ctx || !this.gainNode) return;
    if (!on) {
      this.ambientNode?.stop();
      this.ambientWobbleNode?.stop();
      this.ambientNode = null;
      this.ambientWobbleNode = null;
      return;
    }
    if (this.muted || this.ambientNode) return;

    const startAmbient = async () => {
      const ok = await this.ensureReady();
      if (!ok || !this.ctx || !this.gainNode || this.ambientNode || this.muted || !this.wantsAmbient) return;

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 232;

      const ambientGain = this.ctx.createGain();
      ambientGain.gain.value = 0.02;

      const wobble = this.ctx.createOscillator();
      const wobbleGain = this.ctx.createGain();
      wobble.type = 'sine';
      wobble.frequency.value = 0.5;
      wobbleGain.gain.value = 8;

      wobble.connect(wobbleGain);
      wobbleGain.connect(osc.frequency);

      osc.connect(ambientGain);
      ambientGain.connect(this.gainNode);

      osc.start();
      wobble.start();

      this.ambientNode = osc;
      this.ambientWobbleNode = wobble;
    };

    void startAmbient();
  }
}

export const audio = new AudioManager();
