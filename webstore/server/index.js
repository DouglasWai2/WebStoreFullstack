import express from "express";
import fs from "fs";
import path from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(<App />);
  const indexFile = path.resolve('./dist/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.use(express.static('./dist'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});