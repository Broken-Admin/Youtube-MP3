// Clean out the 'out' folder.
// That is where the Mp4s are stored before and after conversion to mp3.
const folder = './out';
const fs = require('fs');

fs.readdir(folder, (err, files) => {
  for (i in files) {
    fs.unlink(`${folder}/${files[i]}`, (err) => {
      if (err) throw err;
    });
  }
})