class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private gainNode: GainNode | null = null;
  private websiteMusicTimer: number | null = null;
  private gameMusicTimer: number | null = null;
  private currentScene: 'none' | 'website' | 'game' = 'none';
  private typingLastAt = 0;

  init() {
    if (typeof window === 'undefined' || this.ctx) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.06;
    this.gainNode.connect(this.ctx.destination);

    const unlock = () => {
      void this.ensureReady();
      if (!this.muted) this.resumeSceneMusic();
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
    if (this.gainNode) this.gainNode.gain.value = muted ? 0 : 0.06;
    if (muted) {
      this.stopMusic();
      return;
    }
    this.resumeSceneMusic();
  }

  setSceneMusic(scene: 'none' | 'website' | 'game') {
    this.currentScene = scene;
    if (scene === 'none') {
      this.stopMusic();
      return;
    }
    if (this.muted) return;
    this.startSceneMusic(scene);
  }

  private resumeSceneMusic() {
    if (this.currentScene === 'none') return;
    this.startSceneMusic(this.currentScene);
  }

  private stopMusic() {
    if (this.websiteMusicTimer) {
      window.clearInterval(this.websiteMusicTimer);
      this.websiteMusicTimer = null;
    }
    if (this.gameMusicTimer) {
      window.clearInterval(this.gameMusicTimer);
      this.gameMusicTimer = null;
    }
  }

  private startSceneMusic(scene: 'website' | 'game') {
    this.stopMusic();
    if (scene === 'website') this.startWebsiteMusic();
    if (scene === 'game') this.startGameMusic();
  }

  private async tone({ type, frequency, duration, volume = 0.08, slideTo }: {
    type: OscillatorType;
    frequency: number;
    duration: number;
    volume?: number;
    slideTo?: number;
  }) {
    if (this.muted) return;
    const ok = await this.ensureReady();
    if (!ok || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  private startWebsiteMusic() {
    const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 880];
    let idx = 0;
    this.websiteMusicTimer = window.setInterval(() => {
      const main = melody[idx % melody.length];
      const harmony = main / 2;
      void this.tone({ type: 'triangle', frequency: main, slideTo: main * 1.015, duration: 0.42, volume: 0.03 });
      void this.tone({ type: 'sine', frequency: harmony, duration: 0.42, volume: 0.02 });
      idx += 1;
    }, 460);
  }

  private startGameMusic() {
    const bass = [164.81, 146.83, 196, 220, 196, 174.61];
    const lead = [329.63, 392, 440, 523.25, 493.88, 440];
    let idx = 0;
    this.gameMusicTimer = window.setInterval(() => {
      const i = idx % bass.length;
      void this.tone({ type: 'square', frequency: bass[i], duration: 0.25, volume: 0.03 });
      void this.tone({ type: 'triangle', frequency: lead[i], slideTo: lead[i] * 1.02, duration: 0.22, volume: 0.028 });
      idx += 1;
    }, 280);
  }

  click() {
    void this.tone({ type: 'sine', frequency: 610, slideTo: 860, duration: 0.07, volume: 0.05 });
  }

  jump() {
    void this.tone({ type: 'triangle', frequency: 300, slideTo: 520, duration: 0.11, volume: 0.075 });
  }

  token() {
    void this.tone({ type: 'triangle', frequency: 780, slideTo: 1060, duration: 0.12, volume: 0.09 });
    window.setTimeout(() => void this.tone({ type: 'sine', frequency: 920, slideTo: 1290, duration: 0.11, volume: 0.07 }), 45);
  }

  oops() {
    void this.tone({ type: 'sawtooth', frequency: 260, slideTo: 150, duration: 0.16, volume: 0.06 });
  }

  tada() {
    void this.tone({ type: 'triangle', frequency: 620, slideTo: 910, duration: 0.12, volume: 0.09 });
    window.setTimeout(() => void this.tone({ type: 'triangle', frequency: 810, slideTo: 1180, duration: 0.14, volume: 0.1 }), 90);
    window.setTimeout(() => void this.tone({ type: 'sine', frequency: 980, slideTo: 1390, duration: 0.16, volume: 0.09 }), 170);
  }

  envelopeOpen() {
    void this.tone({ type: 'triangle', frequency: 260, slideTo: 520, duration: 0.2, volume: 0.06 });
    window.setTimeout(() => void this.tone({ type: 'sine', frequency: 540, slideTo: 690, duration: 0.1, volume: 0.04 }), 60);
  }

  envelopeClose() {
    void this.tone({ type: 'triangle', frequency: 480, slideTo: 250, duration: 0.16, volume: 0.05 });
  }

  paperSlide() {
    void this.tone({ type: 'sawtooth', frequency: 420, slideTo: 330, duration: 0.24, volume: 0.03 });
  }

  typeKey() {
    const now = Date.now();
    if (now - this.typingLastAt < 35) return;
    this.typingLastAt = now;
    void this.tone({ type: 'square', frequency: 1500, slideTo: 1380, duration: 0.028, volume: 0.018 });
  }
}

export const audio = new AudioManager();
