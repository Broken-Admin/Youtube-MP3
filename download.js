const args = process.argv.slice(2)
if (!args[0] || !args[1]) {
  console.log('Must provide video url and file name.')
  console.log('node main.js [url] [name]')
  process.exit(1)
}
const fs = require('fs');
const ytdl = require('ytdl-core');
const {
  getInfo
} = require('ytdl-getinfo')
const converter = require('video-converter')
const Delay = require('delay')
if (!fs.readFile('./config.json', (err, data) => {
    return (data ? true : false)
  })) {
  throw ('You must have a config file specifying the path to FFMPEG using \"ffmpegPath\".')
}
const config = require('./config.json')

function secToMs(sec) {
  return (sec * 1000)
}
converter.setFfmpegPath(config.ffmpegPath, function (err) {
  if (err) throw err;
});
async function run(seconds) {
  await ytdl(`${args[0]}`)
    .pipe(fs.createWriteStream(`./down/${args[1]}.mp4`))
  await Delay(secToMs(seconds))
  await converter.convert(`./down/${args[1]}.mp4`, `./out/${args[1]}.mp3`, function (err) {
    if (err) throw err;
    console.log(`\"${args[1]}.mp3\" downloaded!`)
  });
}
getInfo(args[0]).then(i => {
  let dur = i.items[0].duration // Duration of video in seconds.
  let durMin = dur / 60 // Duration of video in minutes. (not floored)
  let waitTime = Math.floor(durMin.toFixed(1) * 1.6)
  // We round the durMins to the tenth place.
  // 5 seconds for every 3 minutes. (or such) | (5/3 = 1.6666667) (We round that to 1.6)
  // We floor to at least have a rational integer.
  run(waitTime)
})