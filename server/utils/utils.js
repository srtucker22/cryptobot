import _ from 'underscore';
import fs from 'fs';
import path from 'path';

const ASSETS_LOCATION = path.join(__dirname, '../assets');

// select a random file from the assets directory
export function getRandomFile() {
  const files = _.filter(
    fs.readdirSync(ASSETS_LOCATION), file=> ~file.indexOf('.txt')
  );

  return path.join(
    ASSETS_LOCATION,
    files[Math.floor(Math.random() * (files.length))]
  );
}

export function getFile(filename) {
  return path.join(
    ASSETS_LOCATION,
    filename
  );
}

// get a random quote from the file at 'path' of length 'size' that starts and ends with whole words
export function getText(path) {
  return fs.readFileSync(path).toString().replace(/(?:\r\n|\r|\n)/g, ' ');
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

export function cartesianProduct() {
  return _.reduce(arguments, function(a, b) {
    return _.flatten(_.map(a, function(x) {
      return _.map(b, function(y) {
        return x + y;
      });
    }), true);
  }, [[]]);
};
