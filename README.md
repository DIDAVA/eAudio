# eAudio
**Extended HTML Audio Object**

This project is supposed to keep standard html audio object and add missing features to it with the help of `Web Audio API`.
`AudioContext` is not supported in some old browsers such as `Microsoft Internet Explorer`. Please try this object with the latest modern browsers like `Chrome`, `Firefox` and `Safari`.

## Features
* 10 Band Equalizer
* FadeIn
* FadeOut
* PlayToggle
* Preset
* Spectrum Analyser

## Basic Setup
`eAudio` setup and functionality is the same as standard html audio object: 
```html
<div id="container"></div>
<script src="js/eAudio.js"></script>
<script>
  const audio = new eAudio('your_audio_file.mp3');
  audio.controls = true;
  document.querySelector('container').appendChild(audio);
</script>
```

## EQ
`eAudio` comes with 10 band equalizer. The frequency bands are adjusted on standard harmonic octaves (`31Hz`, `63Hz`, `125Hz`, `250Hz`, `500Hz`, `1kHz`, `2kHz`, `4kHz`, `8kHz`, `16kHz`). The gain for each band is limited between `+6db` and `-24db` to prevent output distortion and band converage. The default gain value for each band is `0`.
```javascript
audio.q31 = 0;
audio.q63 = 0;
audio.q125 = 0;
audio.q250 = 0;
audio.q500 = 0;
audio.q1000 = 0;
audio.q2000 = 0;
audio.q4000 = 0;
audio.q8000 = 0;
audio.q16000 = 0;
```

## FadeIn / FadeOut
Both fadein and fadeout are separated methods on the `eAudio` object. The fading time can be passed as an argument to the fader methods. If no argument is passed they will use their default value which is `3 seconds`. Please be informed that faders do not have callbacks and will not affect play and pause methods on audio object.
```javascript
audio.fadein(); // 3 seconds by default
audio.fadein(10); // 10 seconds
audio.fadeout(); // 3 seconds by default
audio.fadeout(10); // 10 seconds
```

## PlayToggle
You can play/pause audio more easily by playToggle property:
```javascript
audio.playToggle = true; // Plays the audio
audio.playToggle = false; // Pauses the audio

// Toggle playback by clicking a button
document.querySelector('button').addEventListener('click', e => {
  audio.playToggle = !audio.playToggle; // Toggles play/pause
});
```

## Preset
This property can set or get the current `source`, `equalizer` and `volume` settings as an json string. It is useful to save your current settings to database or file and simply set all the settings very fast.
```javascript
const currentSettings = audio.preset; // Get the json settings string

audio.preset = currentSettings; // Set the settings back
```