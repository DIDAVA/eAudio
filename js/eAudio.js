const AudioContext = window.AudioContext || window.webkitAudioContext;

class eAudio extends Audio {
  constructor(src){
    const eAudioCompatibility = [
      typeof Audio === 'function',
      typeof AudioContext === 'function',
      typeof GainNode === 'function',
      typeof DynamicsCompressorNode === 'function',
      typeof BiquadFilterNode === 'function'
    ];
    if (eAudioCompatibility.includes(false)) throw new Error('Incompatible Browser');

    super();
    const actx = new AudioContext();
    const source = actx.createMediaElementSource(this);
    const fader = actx.createGain();
    let chain = [source, fader];

    this.eq = {};
    const octaves = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    octaves.forEach( (freq, index) => {
      const filter = actx.createBiquadFilter();
      if (index == 0) filter.type = 'lowshelf';
      else if (index == octaves.length - 1) filter.type = 'highshelf';
      else filter.type = 'peaking';
      filter.frequency.value = freq;
      Object.defineProperty(this.eq, freq, {
        enumerable: true,
        get(){ return filter.gain.value },
        set(value){
          if (value > 6) value = 6;
          else if (value < -12) value = -12;
          filter.gain.value = value;
        }
      });
      chain.push(filter);
    });

    const limiter = actx.createDynamicsCompressor();
    limiter.attack.value = limiter.attack.maxValue;
    limiter.release.value = limiter.release.maxValue;
    limiter.threshold.value = limiter.threshold.maxValue;
    limiter.ratio.value = limiter.ratio.minValue;
    limiter.knee.value = limiter.knee.maxValue;
    const master = actx.createGain();

    chain.push(limiter, master, actx.destination);
    chain.forEach( (node, index) => { if (index != 0) chain[index-1].connect(node) });

    Object.defineProperties(eAudio.prototype, {
      volume: {
        enumerable: true,
        get(){ return master.gain.value },
        set(value){ master.gain.value = value }
      }
    });

    eAudio.prototype.fadein = function(time = 3){
      fader.gain.exponentialRampToValueAtTime(1, actx.currentTime + time)
    }

    eAudio.prototype.fadeout = function(time = 3){
      fader.gain.exponentialRampToValueAtTime(0.000001, actx.currentTime + time)
    }

    this.src = src;
  }
}
