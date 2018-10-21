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
var configExists
fs.readFile('config.json', (err, data) => {
  if(!data){
    console.log('Must provide a config file, with an object with the attribute \"ffmpegPath\" leading to the path of which you have FFMPEG stored.')
    process.exit() // If evaluates to true, send above to logs, and exit the process.
  }
})
delete(configExists)
function minutesToSeconds(min){ // Line 32
  return(min * 60)
}
const config = require('./config.json')
converter.setFfmpegPath(config.ffmpegPath, function (err) {
  if (err) throw err;
});
async function run(min) {
  await ytdl(`${args[0]}`)
    .pipe(fs.createWriteStream(`./down/${args[1]}.mp4`))
    await minutesToSeconds(min) // convert the minutes to seconds, and delay for that allotted time.
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
  // We floor to at least have a rational (whole) integer.
  run(waitTime)
})