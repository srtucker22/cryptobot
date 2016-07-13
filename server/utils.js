import fs from 'fs';
import path from 'path';

const ASSETS_LOCATION = '/assets';

// select a random file from the assets directory
export function getRandomFile() {
  const files = fs.readdirSync(path.join(__dirname, ASSETS_LOCATION));
  return path.join(
    __dirname,
    ASSETS_LOCATION,
    files[Math.floor(Math.random() * (files.length))]
  );
}

// get a random quote from the file at 'path' of length 'size' that starts and ends with whole words
export function getRandomQuote(path, size) {
  let file = fs.readFileSync(path).toString().replace(/(?:\r\n|\r|\n)/g, ' ');
  const start = Math.floor(Math.random() * (file.length - size));

  return file.substring(
    file.indexOf(' ', start) + 1,
    file.indexOf(' ', start + size)
  );
}
