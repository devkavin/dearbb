class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private ambientNode: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  init() {
    if (typeof window === 'undefined' || this.ctx) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.03;
    this.gainNode.connect(this.ctx.destination);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.gainNode) this.gainNode.gain.value = muted ? 0 : 0.03;
  }

  private beep(type: OscillatorType, frequency: number, duration = 0.12) {
    this.init();
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.07;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.stop(this.ctx.currentTime + duration);
  }

  jump() { this.beep('sine', 280, 0.12); }
  token() { this.beep('triangle', 740, 0.18); }
  click() { this.beep('square', 420, 0.06); }
  oops() { this.beep('sawtooth', 140, 0.12); }
  tada() {
    this.beep('triangle', 520, 0.12);
    setTimeout(() => this.beep('triangle', 700, 0.15), 80);
  }

  ambient(on: boolean) {
    this.init();
    if (!this.ctx || !this.gainNode) return;
    if (!on) {
      this.ambientNode?.stop();
      this.ambientNode = null;
      return;
    }
    if (this.ambientNode) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 190;
    const tremolo = this.ctx.createGain();
    tremolo.gain.value = 0.03;
    osc.connect(tremolo);
    tremolo.connect(this.gainNode);
    osc.start();
    this.ambientNode = osc;
  }
}

export const audio = new AudioManager();
