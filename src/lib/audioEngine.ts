/**
 * 16-bit Mythical SNES Audio Synthesizer Engine
 * Inspired by A Link to the Past & Classic 16-Bit Fantasy RPGs
 */

export type MythicalTrack = 'overworld' | 'sanctuary' | 'battle' | 'village' | 'dungeon' | 'combat';

export interface TrackMetadata {
  id: MythicalTrack;
  title: string;
  composerLore: string;
  mood: string;
}

export const MYTHICAL_TRACKS: TrackMetadata[] = [
  {
    id: 'overworld',
    title: 'The Sovereign Overworld March',
    composerLore: 'Echoes across the green meadows of Valuaria, inspiring brave traders.',
    mood: 'Heroic & Adventurous'
  },
  {
    id: 'sanctuary',
    title: 'Sanctuary of the Great Value Fairy',
    composerLore: 'Shimmering harp arpeggios reminiscent of sacred springs and Graham’s wisdom.',
    mood: 'Ethereal & Serene'
  },
  {
    id: 'battle',
    title: 'Clash of the Volatility Guardians',
    composerLore: 'Driving 16-bit bassline and intense brass leads for epic boss showdowns.',
    mood: 'Urgent & Dramatic'
  },
  {
    id: 'village',
    title: 'Kakariko Exchange & Derivatives Tavern',
    composerLore: 'Gentle pastoral counterpoint where brokers quote spreads in peace.',
    mood: 'Pastoral & Warm'
  }
];

class MythicalAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.25;
  private isMusicPlaying: boolean = false;
  private currentTrack: MythicalTrack = 'overworld';
  private loopTimer: any = null;
  private step: number = 0;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public getCurrentTrack(): MythicalTrack {
    return this.currentTrack;
  }

  public isBgmPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // --- 16-BIT RETRO SOUND EFFECTS ---

  /**
   * Sacred Save Shrine Chime (Heavenly ALttP fairy/save jingle)
   */
  public playSaveGame() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Beautiful ascending harp & chime arpeggio: C5, E5, G5, B5, C6, E6, G6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.12 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      });

      // Sparkle shimmer overtone
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(2093, now + 0.56); // C7
      chimeGain.gain.setValueAtTime(0.1 * this.masterVolume, now + 0.56);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(now + 0.56);
      chimeOsc.stop(now + 1.2);
    } catch {}
  }

  /**
   * Sword Slash with 16-bit Blade Gleam
   */
  public playSwordSlash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

      gain.gain.setValueAtTime(0.15 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  /**
   * Shield Parrying Clang
   */
  public playShieldBlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1100, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);

      gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  /**
   * Rupee / Florin Clink
   */
  public playCoinSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

      gain.gain.setValueAtTime(0.14 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  /**
   * Heart Container / Great Reward Fanfare
   */
  public playHeartContainer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [329.63, 392.00, 493.88, 659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.085;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.16 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {}
  }

  /**
   * Classic Zelda 8-note Secret Discovery Jingle
   */
  public playSecretChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [392, 370, 311, 220, 207.65, 330, 415.3, 523.25];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = this.ctx!.currentTime + i * 0.075;

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.12 * this.masterVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      });
    } catch {}
  }

  /**
   * Alarm / Heart Damage
   */
  public playAlarmSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(320, now + 0.08);

      gain.gain.setValueAtTime(0.18 * this.masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  public playCommandBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1 * this.masterVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  public playKeyClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03 * this.masterVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch {}
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15 * this.masterVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {}
  }

  // Compatibility Aliases for Combat & Modals
  public playAttackSound() {
    this.playSwordSlash();
  }

  public playSpellCast() {
    this.playSecretChime();
  }

  public playRugPullExplosion() {
    this.playAlarmSound();
  }

  // --- POLYPHONIC 16-BIT SNES MUSIC SYNTHESIZER ---

  public toggleMusic(track?: MythicalTrack): boolean {
    if (this.isMusicPlaying) {
      if (track && track !== this.currentTrack) {
        this.startMusic(track);
        return true;
      }
      this.stopMusic();
      return false;
    } else {
      this.startMusic(track || this.currentTrack);
      return true;
    }
  }

  public startMusic(track: MythicalTrack = 'overworld') {
    if (this.isMuted) return;
    this.stopMusic();
    this.initContext();
    if (!this.ctx) return;

    const normalizedTrack: MythicalTrack = 
      track === 'dungeon' ? 'overworld' : 
      track === 'combat' ? 'battle' : track;

    this.currentTrack = normalizedTrack;
    this.isMusicPlaying = true;
    this.step = 0;

    // Rich multi-track music patterns (Lead, Harmony, Bass, Harp Arp)
    if (normalizedTrack === 'sanctuary') {
      this.playSanctuaryHarpLoop();
    } else if (normalizedTrack === 'battle') {
      this.playBattleThemeLoop();
    } else if (normalizedTrack === 'village') {
      this.playVillageThemeLoop();
    } else {
      this.playOverworldMarchLoop();
    }
  }

  /**
   * Track 1: ALttP Hyrule Overworld March (F Major / D Minor heroic motif)
   */
  private playOverworldMarchLoop() {
    // 16-step heroic melody in F / Bb / C / Dm
    const melody = [
      349.23, 0, 440.00, 523.25, // F4, A4, C5
      587.33, 523.25, 440.00, 0,  // D5, C5, A4
      392.00, 440.00, 466.16, 523.25, // G4, A4, Bb4, C5
      440.00, 349.23, 0, 0,       // A4, F4
      523.25, 587.33, 659.25, 698.46, // C5, D5, E5, F5
      659.25, 587.33, 523.25, 0,  // E5, D5, C5
      466.16, 523.25, 440.00, 392.00, // Bb4, C5, A4, G4
      349.23, 0, 440.00, 349.23   // F4, A4, F4
    ];

    const bass = [
      174.61, 174.61, 220.00, 174.61, // F bass
      233.08, 233.08, 261.63, 233.08, // Bb bass
      196.00, 196.00, 220.00, 196.00, // G bass
      174.61, 220.00, 261.63, 174.61, // F bass
      146.83, 146.83, 174.61, 146.83, // Dm bass
      233.08, 233.08, 261.63, 233.08, // Bb bass
      130.81, 130.81, 174.61, 196.00, // C bass
      174.61, 174.61, 261.63, 174.61  // F bass
    ];

    const stepDuration = 220; // ms

    this.loopTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      try {
        const curStep = this.step % melody.length;
        const now = this.ctx.currentTime;

        // Channel 1: Lead Melody (Heroic Square / Pulse with soft vibrato)
        const leadFreq = melody[curStep];
        if (leadFreq > 0) {
          const leadOsc = this.ctx.createOscillator();
          const leadGain = this.ctx.createGain();
          leadOsc.type = 'triangle';
          leadOsc.frequency.setValueAtTime(leadFreq, now);

          leadGain.gain.setValueAtTime(0.08 * this.masterVolume, now);
          leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          leadOsc.connect(leadGain);
          leadGain.connect(this.ctx.destination);
          leadOsc.start(now);
          leadOsc.stop(now + 0.28);
        }

        // Channel 2: Bassline (Warm rhythmic pulse)
        const bassFreq = bass[curStep];
        if (bassFreq > 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.12 * this.masterVolume, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.2);
        }

        // Channel 3: March Snare Click on beats 2 & 4
        if (curStep % 2 === 1) {
          const snareOsc = this.ctx.createOscillator();
          const snareGain = this.ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(120, now);
          snareGain.gain.setValueAtTime(0.03 * this.masterVolume, now);
          snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          snareOsc.connect(snareGain);
          snareGain.connect(this.ctx.destination);
          snareOsc.start(now);
          snareOsc.stop(now + 0.06);
        }

        this.step++;
      } catch {}
    }, stepDuration);
  }

  /**
   * Track 2: Sacred Sanctuary / Great Fairy Fountain Harp Arpeggios
   */
  private playSanctuaryHarpLoop() {
    // Ethereal descending & ascending harp arpeggio: Ab major / F minor / Db major / Eb7
    const chords = [
      [207.65, 261.63, 311.13, 415.30, 523.25, 622.25, 830.61], // Ab major 7
      [174.61, 207.65, 261.63, 349.23, 415.30, 523.25, 698.46], // F minor
      [138.59, 174.61, 207.65, 277.18, 349.23, 415.30, 554.37], // Db major
      [155.56, 196.00, 233.08, 311.13, 392.00, 466.16, 622.25], // Eb dominant
    ];

    const stepDuration = 140; // Fast sparkling arpeggio

    this.loopTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      try {
        const chordIdx = Math.floor(this.step / 12) % chords.length;
        const activeChord = chords[chordIdx];
        const subStep = this.step % 12;

        // Ascend then descend
        const noteIndex = subStep < 6 ? subStep : 12 - subStep;
        const noteFreq = activeChord[Math.min(activeChord.length - 1, noteIndex)];

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        // Soft shimmering envelope
        gain.gain.setValueAtTime(0.07 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);

        // Root bass swell on first beat of chord
        if (subStep === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(activeChord[0] / 2, now);
          bassGain.gain.setValueAtTime(0.14 * this.masterVolume, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 1.2);
        }

        this.step++;
      } catch {}
    }, stepDuration);
  }

  /**
   * Track 3: Guardian Boss Battle (Intense Driving 16-bit Battle Theme)
   */
  private playBattleThemeLoop() {
    // Fast dramatic combat motif in C minor / Ab / Bb / G
    const battleRiffs = [
      261.63, 311.13, 392.00, 523.25, 466.16, 392.00, 311.13, 261.63,
      233.08, 293.66, 349.23, 466.16, 440.00, 349.23, 293.66, 233.08,
      207.65, 261.63, 311.13, 415.30, 392.00, 311.13, 261.63, 207.65,
      196.00, 246.94, 293.66, 392.00, 370.00, 293.66, 246.94, 196.00
    ];

    const battleBass = [
      65.41, 130.81, 65.41, 130.81,
      58.27, 116.54, 58.27, 116.54,
      51.91, 103.83, 51.91, 103.83,
      49.00, 98.00,  49.00, 98.00
    ];

    const stepDuration = 160;

    this.loopTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      try {
        const curStep = this.step % battleRiffs.length;
        const now = this.ctx.currentTime;

        // Lead riff
        const leadFreq = battleRiffs[curStep];
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(leadFreq, now);
        leadGain.gain.setValueAtTime(0.08 * this.masterVolume, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        leadOsc.connect(leadGain);
        leadGain.connect(this.ctx.destination);
        leadOsc.start(now);
        leadOsc.stop(now + 0.19);

        // Driving bass
        const bassFreq = battleBass[curStep % battleBass.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.14 * this.masterVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.14);

        this.step++;
      } catch {}
    }, stepDuration);
  }

  /**
   * Track 4: Peaceful Village & Trading Post (Kakariko-style waltz)
   */
  private playVillageThemeLoop() {
    const melody = [
      261.63, 329.63, 392.00, 440.00, 392.00, 329.63,
      293.66, 349.23, 440.00, 493.88, 440.00, 349.23,
      329.63, 392.00, 523.25, 493.88, 440.00, 392.00,
      261.63, 0, 0, 261.63, 329.63, 392.00
    ];

    const stepDuration = 260;

    this.loopTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      try {
        const curStep = this.step % melody.length;
        const now = this.ctx.currentTime;
        const leadFreq = melody[curStep];

        if (leadFreq > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(leadFreq, now);
          gain.gain.setValueAtTime(0.09 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        }

        this.step++;
      } catch {}
    }, stepDuration);
  }

  public stopMusic() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sound = new MythicalAudioEngine();
