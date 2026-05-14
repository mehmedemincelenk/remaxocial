const { getAudioDurationInSeconds } = require('get-audio-duration');
const path = require('path');

const audioPath = path.join(__dirname, '../public/news-voice-real.mp3');

getAudioDurationInSeconds(audioPath).then((duration) => {
  console.log(`DURATION:${duration}`);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
