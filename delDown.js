// Clean out the 'down' folder.
// That is where the converted Mp3s are stored.
const folder = './down';
const fs = require('fs');

fs.readdir(folder, (err, files) => {
  for (i in files) {
    fs.unlink(`${folder}/${files[i]}`, (err) => {
      if (err) throw err;
    });
  }
})