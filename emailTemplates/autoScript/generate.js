const fs = require('fs');
const { parse } = require('node-html-parser');

const { handleCssContextToObject, addStyleToDom } = require('./untils');

const writeFile = (path, jsonstring) => {
  const streamWrite = fs.createWriteStream(path);
  streamWrite.write(jsonstring);
  streamWrite.end();
  streamWrite.on('error', err => {
    throw err;
  });
  streamWrite.on('finish', () => {
    console.log(`write ${path} finished`);
  });
};

const transfrom = fileName => {
  const inputText = fs.readFileSync(`./input/${fileName}`, 'utf-8');
  const inputTextDom = parse(inputText);
  const cssContext = fs.readFileSync('./style.css', 'utf-8');
  const cssObject = handleCssContextToObject(cssContext);

  for (let [key, value] of Object.entries(cssObject)) {
    for (let dom of inputTextDom.querySelectorAll(key)) {
      dom = addStyleToDom(dom, value);
    };
  }

  writeFile(`./output/${fileName}`, inputTextDom.outerHTML);
};

fs.readdir('./input', (err, files) => {
  if (err) {
    console.log('read ./input error');
    console.log(err);
  }

  if (files.length === 0) {
    console.log('error: no file in ./input');
  }

  files.forEach(file => {
    transfrom(file);
  });
});
