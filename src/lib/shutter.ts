/**
 * Camera shutter, synthesised at runtime — no audio file, no licensing.
 *
 * A DSLR shutter is essentially two filtered noise transients (mirror up, then
 * shutter close) over a short low-frequency body thump. Each play is jittered
 * slightly so repeated clicks don't sound like a looping sample.
 */
export function playShutter(ctx: AudioContext, volume = 0.32) {
  const now = ctx.currentTime;
  const jitter = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  // Filtered noise burst with a near-instant attack and fast decay.
  const burst = (at: number, dur: number, freq: number, q: number, peak: number) => {
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq * jitter(0.06);
    filter.Q.value = q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(peak, now + at + 0.0012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);

    source.connect(filter).connect(gain).connect(master);
    source.start(now + at);
    source.stop(now + at + dur + 0.02);
  };

  const gap = 0.052 * jitter(0.12);

  burst(0, 0.032, 3400, 1.3, 1);          // mirror up — bright snap
  burst(gap, 0.048, 1450, 0.9, 0.72);     // shutter close — duller

  // Low mechanical body under the transients.
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(190 * jitter(0.08), now);
  osc.frequency.exponentialRampToValueAtTime(62, now + 0.085);
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.28, now + 0.004);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
  osc.connect(oscGain).connect(master);
  osc.start(now);
  osc.stop(now + 0.13);
}
