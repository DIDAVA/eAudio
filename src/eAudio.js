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

    const octaves = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    octaves.forEach( (freq, index) => {
      const filter = actx.createBiquadFilter();
      if (index == 0) filter.type = 'lowshelf';
      else if (index == octaves.length - 1) filter.type = 'highshelf';
      else filter.type = 'peaking';
      filter.frequency.value = freq;
      const name = `q${freq}`;
      Object.defineProperty(this, name, {
        enumerable: true,
        get(){ return filter.gain.value },
        set(value){
          if (value > 6) value = 6;
          else if (value < -24) value = -24;
          filter.gain.value = value;
        }
      });
      chain.push(filter);
    });

    const analyser = actx.createAnalyser();
    analyser.maxDecibels = -9;
    analyser.minDecibels = -96;
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;
    let fbc = new Uint8Array(analyser.frequencyBinCount);

    chain.push(analyser, actx.destination);
    chain.forEach( (node, index) => { if (index != 0) chain[index-1].connect(node) });

    Object.defineProperties(eAudio.prototype, {
      playToggle: {
        enumerable: true,
        get(){ return !audio.paused },
        set(value){
          if (typeof value === 'boolean') {
            if (audio.paused) audio.play();
            else audio.pause();
          }
        }
      },
      specLines: {
        enumerable: true,
        get(){ return analyser.fftSize },
        set(value){
          if ([16,32,64,128,256,512,1024].includes(value)) {
            analyser.fftSize = value * 2;
            fbc = new Uint8Array(analyser.frequencyBinCount);
          }
        }
      },
      specSmooth: {
        enumerable: true,
        get(){ return analyser.smoothingTimeConstant },
        set(value){ 
          if (typeof value === 'number' && value >= 0 && value <= 1) 
            analyser.smoothingTimeConstant = value;
        }
      },
      specFreq: {
        enumerable: true,
        get(){
          analyser.getByteFrequencyData(fbc);
          return fbc;
        }
      },
      specDomain: {
        enumerable: true,
        get(){
          analyser.getByteTimeDomainData(fbc);
          return fbc;
        }
      },
      preset: {
        enumerable: true,
        get(){ return JSON.stringify({
          s: this.currentSrc,
          v: this.volume,
          0: this.q31,
          1: this.q63,
          2: this.q125,
          3: this.q250,
          4: this.q500,
          5: this.q1000,
          6: this.q2000,
          7: this.q4000,
          8: this.q8000,
          9: this.q16000
        })},
        set(json){
          const obj = JSON.parse(json);
            if (typeof obj === 'object') {
            if (typeof obj.s === 'string') this.src = obj.s;
            if (typeof obj.v === 'number') this.volume = obj.v;
            if (typeof obj[0] === 'number') this.q31 = obj[0];
            if (typeof obj[1] === 'number') this.q63 = obj[1];
            if (typeof obj[2] === 'number') this.q125 = obj[2];
            if (typeof obj[3] === 'number') this.q250 = obj[3];
            if (typeof obj[4] === 'number') this.q500 = obj[4];
            if (typeof obj[5] === 'number') this.q1000 = obj[5];
            if (typeof obj[6] === 'number') this.q2000 = obj[6];
            if (typeof obj[7] === 'number') this.q4000 = obj[7];
            if (typeof obj[8] === 'number') this.q8000 = obj[8];
            if (typeof obj[9] === 'number') this.q16000 = obj[9];
          }
        }
      }
    });

    eAudio.prototype.fadein = function(time = 3){
      fader.gain.linearRampToValueAtTime(1, actx.currentTime + time)
    }

    eAudio.prototype.fadeout = function(time = 3){
      fader.gain.linearRampToValueAtTime(0.000001, actx.currentTime + time)
    }

    if (src) this.src = src;
  }
}
