const { nanoid } = require("nanoid");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

async function haikuImageService(haiku, options) {
  const id = nanoid();

  const url = `http://localhost:5000/img?t1=${encodeURIComponent(
    haiku[0]
  )}&t2=${encodeURIComponent(haiku[1])}&t3=${encodeURIComponent(haiku[2])}&bg=${
    options.background
  }`;

  const response = await fetch(url);
  const buffer = await response.buffer();
  return new Promise((resolve) => {
    fs.writeFile(
      path.join(__dirname, `../public/haiku-images/${id}.jpg`),
      buffer,
      resolve
    );
  }).then(() => id);
}

module.exports = haikuImageService;
