const favicon = require('serve-favicon');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(path.resolve(process.cwd(), './'))));
app.use(favicon(path.join(path.resolve(process.cwd(), './favicon.ico'))));

app.get('/*', function (req, res) {
  res.sendFile(path.join(path.resolve(process.cwd(), 'input'), req.params[0]));
});

app.listen('3001');