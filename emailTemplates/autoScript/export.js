const fs = require('fs');
const path = require('path');

const filePath = path.resolve(`${__dirname}/output`);
fs.readdir('./output', 'utf8', async (err, files) => {
  if (err) {
    console.log('read ./output error');
    console.log(err);
    return;
  }

  if (files.length === 0) {
    console.log('error: no file in ./input');
    return;
  }

  files.forEach((file) => {
    fs.readFile(`${filePath}/${file}`, 'utf8', async (error, data) => {
      if (error) {
        console.log(err);
        return;
      }
      if (!fs.existsSync('../live')) {
        fs.mkdirSync('../live');
      }
      fs.writeFile(`../live/${file}`, data, 'utf8', (writeErr) => {
        if (writeErr) {
          console.log(writeErr);
        }
      });
      if (!fs.existsSync('../staging')) {
        fs.mkdirSync('../staging');
      }
      const result = data.replace(
        /https:\/\/www.bunkertech.id/g,
        'https://stg.bunkertech.id',
      );
      fs.writeFile(`../staging/${file}`, result, 'utf8', writeErr => {
        if (writeErr) {
          console.log(writeErr);
        }
      });
    });
  });
});
