import fs from 'fs';
import path from 'path';

const ASSETS_LOCATION = '/assets';

export function getFileSize(path) {
  return fs.statSync(filename).size;
}

export function getRandomFile() {
  const files = fs.readdirSync(path.join(__dirname, ASSETS_LOCATION));
  return path.join(
    __dirname,
    ASSETS_LOCATION,
    files[Math.floor(Math.random() * (files.length))]
  );
}

export function partialFSReadSync(path, start, end) {
  if (start < 0 || end < 0 || end < start || end - start > 0x3fffffff)
    throw new Error('bad start, end');
  if (end - start === 0)
    return new Buffer(0);

  const buf = new Buffer(end - start);
  const fd = fs.openSync(path, 'r');
  fs.readSync(fd, buf, 0, end - start, start);
  fs.closeSync(fd);
  return buf;
}
