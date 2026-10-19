/**
 * Web Audio Engine for Serene Study
 * Pure client-side procedural synthesis for 5 ambient sounds,
 * real-time microphone decibel analysis, and session notification bells.
 */

export type SoundType = 'rain' | 'cafe' | 'waves' | 'library' | 'campfire';

export interface SoundPreset {
  id: SoundType;
  name: string;
  subtitle: string;
  icon: string;
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'rain',
    name: '빗소리',
    subtitle: '차분하고 지속적인 창가 빗소리',
    icon: 'water_drop',
  },
  {
    id: 'cafe',
    name: '카페 화이트노이즈',
    subtitle: '적당한 웅성거림과 잔잔한 컵 소리',
    icon: 'local_cafe',
  },
  {
    id: 'waves',
    name: '파도 소리',
    subtitle: '일정한 리듬의 고요한 바닷가 파도',
    icon: 'waves',
  },
  {
    id: 'library',
    name: '도서관 책장 넘기는 소리',
    subtitle: '규칙적인 종이 바스락거림과 적막감',
    icon: 'menu_book',
  },
  {
    id: 'campfire',
    name: '모닥불 소리',
    subtitle: '따뜻하게 타닥거리는 장작 장작불 소리',
    icon: 'local_fire_department',
  },
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentSound: SoundType = 'rain';
  private isPlaying = false;
  private volume = 0.4; // 0 to 1
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private crackleInterval: number | null = null;

  // Mic analysis
  private micStream: MediaStream | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isMicActive = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volPercent: number) {
    this.volume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return Math.round(this.volume * 100);
  }

  public getCurrentSound(): SoundType {
    return this.currentSound;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public stopAmbient() {
    this.isPlaying = false;
    if (this.crackleInterval) {
      window.clearInterval(this.crackleInterval);
      this.crackleInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public playAmbient(sound: SoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopAmbient();
    this.currentSound = sound;
    this.isPlaying = true;

    switch (sound) {
      case 'rain':
        this.startRain();
        break;
      case 'cafe':
        this.startCafe();
        break;
      case 'waves':
        this.startWaves();
        break;
      case 'library':
        this.startLibrary();
        break;
      case 'campfire':
        this.startCampfire();
        break;
    }
  }

  public togglePlay(sound?: SoundType): boolean {
    if (this.isPlaying) {
      if (sound && sound !== this.currentSound) {
        this.playAmbient(sound);
        return true;
      }
      this.stopAmbient();
      return false;
    } else {
      this.playAmbient(sound || this.currentSound);
      return true;
    }
  }

  // --- Rain Generator (Pink noise + lowpass + gentle random droplets) ---
  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        noiseSource.disconnect();
      },
    });
  }

  // --- Waves Generator (Brownian noise modulated by LFO surge) ---
  private startWaves() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    // LFO for ocean wave swell
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.4, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.5, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    lfo.start();
    noiseSource.start();

    this.activeNodes.push({
      stop: () => {
        lfo.stop();
        noiseSource.stop();
        lfo.disconnect();
        noiseSource.disconnect();
      },
    });
  }

  // --- Cafe Ambience Generator (Warm background murmur + gentle coffee clink) ---
  private startCafe() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      data[i] = (b0 + b1 + b2) * 0.2;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, ctx.currentTime);

    const cafeGain = ctx.createGain();
    cafeGain.gain.setValueAtTime(0.65, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(cafeGain);
    cafeGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        noiseSource.disconnect();
      },
    });

    // Occasional gentle cup clink
    this.crackleInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() < 0.35) {
        const osc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        osc.frequency.setValueAtTime(1400 + Math.random() * 800, this.ctx.currentTime);
        pingGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        osc.connect(pingGain);
        pingGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      }
    }, 4000);
  }

  // --- Library Rustle & Stillness Generator ---
  private startLibrary() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.035;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const libGain = ctx.createGain();
    libGain.gain.setValueAtTime(0.4, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(libGain);
    libGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        noiseSource.disconnect();
      },
    });
  }

  // --- Campfire Crackle Generator ---
  private startCampfire() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = data[i];
      data[i] *= 1.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const fireGain = ctx.createGain();
    fireGain.gain.setValueAtTime(0.5, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(fireGain);
    fireGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        noiseSource.disconnect();
      },
    });

    // Random pops and crackles
    this.crackleInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() < 0.6) {
        const osc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200 + Math.random() * 900, this.ctx.currentTime);
        popGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
        osc.connect(popGain);
        popGain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }
    }, 280);
  }

  // --- Bell chime when focus session finishes ---
  public playSessionEndChime() {
    this.initContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 1.9);
    });
  }

  // --- Real-time Mic Listening ---
  public async startMicrophone(onDecibels: (db: number) => void): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;
      this.micSource = this.ctx.createMediaStreamSource(stream);
      this.micAnalyser = this.ctx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.micSource.connect(this.micAnalyser);
      this.isMicActive = true;

      const dataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);
      const checkVolume = () => {
        if (!this.isMicActive || !this.micAnalyser) return;
        this.micAnalyser.getByteTimeDomainData(dataArray);

        let sumSquares = 0.0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        // Map rms (0..1) to realistic ambient dB range (approx 30..85 dB)
        const computedDb = Math.round(30 + Math.min(60, rms * 140));
        onDecibels(computedDb);

        requestAnimationFrame(checkVolume);
      };
      requestAnimationFrame(checkVolume);
      return true;
    } catch {
      this.isMicActive = false;
      return false;
    }
  }

  public stopMicrophone() {
    this.isMicActive = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
  }

  public getIsMicActive(): boolean {
    return this.isMicActive;
  }
}

export const audioEngine = new AudioEngine();
