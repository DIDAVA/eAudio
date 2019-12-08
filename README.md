# eAudio
**Extended HTML Audio Object**

This project is supposed to keep standard html audio object and add missing features to it with the help of `Web Audio API`.
`AudioContext` is not supported in some old browsers such as `Microsoft Internet Explorer`. Please try this object with the latest modern browsers like `Chrome`, `Firefox` and `Safari`.

## Features
* 10 Band Equalizer
* FadeIn
* FadeOut

## Basic Setup
`eAudio` setup and functionality is the same as standard html audio object: 
```html
<div id="container"></div>
<script src="js/eAudio.js"></script>
<script>
  var audio = new eAudio('your_audio_file.mp3');
  audio.controls = true;
  document.querySelector('container').appendChild(audio);
</script>
```

## EQ
`eAudio` comes with 10 band equalizer. The frequency bands are adjusted on standard harmonic octaves (`31Hz`, `63Hz`, `125Hz`, `250Hz`, `500Hz`, `1kHz`, `2kHz`, `4kHz`, `8kHz`, `16kHz`). The gain for each band is limited between `+6db` and `-24db` to prevent output distortion and band converage. The default gain value for each band is `0`.
```javascript
audio.eq[31] = 0;
audio.eq[63] = 0;
audio.eq[125] = 0;
audio.eq[250] = 0;
audio.eq[500] = 0;
audio.eq[1000] = 0;
audio.eq[2000] = 0;
audio.eq[4000] = 0;
audio.eq[8000] = 0;
audio.eq[16000] = 0;
```